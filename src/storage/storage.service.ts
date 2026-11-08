import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export interface StorageObjectResult {
  stream: Readable;
  mimeType?: string;
  contentLength?: number;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client | null = null;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId =
      this.configService.get<string>('AWS_ACCESS_KEY_ID') ||
      process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey =
      this.configService.get<string>('AWS_SECRET_ACCESS_KEY') ||
      process.env.AWS_SECRET_ACCESS_KEY;
    const endpoint =
      this.configService.get<string>('AWS_ENDPOINT_URL_S3') ||
      process.env.AWS_ENDPOINT_URL_S3;
    const region =
      this.configService.get<string>('AWS_REGION') ||
      process.env.AWS_REGION ||
      'eu-central-1';

    this.bucketName =
      this.configService.get<string>('NEON_AUDIO_BUCKET') ||
      process.env.NEON_AUDIO_BUCKET ||
      'submission-audio';

    if (accessKeyId && secretAccessKey && endpoint) {
      this.s3Client = new S3Client({
        region,
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        forcePathStyle: true, // Neon Object Storage требует path-style адресацию
      });
      this.logger.log(`Initialized S3 storage for bucket "${this.bucketName}" at "${endpoint}"`);
    } else {
      this.logger.warn(
        'S3 storage credentials not fully configured. Falling back to database storage for audio files.',
      );
    }
  }

  isConfigured(): boolean {
    return this.s3Client !== null;
  }

  getBucketName(): string {
    return this.bucketName;
  }

  async uploadAudio(
    key: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    if (!this.s3Client) {
      throw new Error('S3 storage client is not configured');
    }

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }),
    );

    return key;
  }

  async getAudioStream(key: string): Promise<StorageObjectResult> {
    if (!this.s3Client) {
      throw new Error('S3 storage client is not configured');
    }

    const response = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );

    if (!response.Body) {
      throw new Error(`Empty response body for object "${key}"`);
    }

    return {
      stream: response.Body as Readable,
      mimeType: response.ContentType,
      contentLength: response.ContentLength,
    };
  }

  async deleteAudio(key: string): Promise<void> {
    if (!this.s3Client) return;

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Failed to delete object "${key}" from storage: ${message}`);
    }
  }
}
