function resolveTypeormExport(exportName) {
  try {
    const typeorm = require('typeorm');
    return typeorm[exportName];
  } catch {
    return undefined;
  }
}

module.exports = {
  resolveTypeormExport,
  Connection: resolveTypeormExport('Connection'),
  AbstractRepository: resolveTypeormExport('AbstractRepository'),
};
