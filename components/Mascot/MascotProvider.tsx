"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Mascot } from "./Mascot";
import { GREETINGS, INVITES, PRAISE, pick } from "./phrases";
import { SpeechBubble } from "./SpeechBubble";
import type { MascotState } from "./types";

const DEFAULT_DURATION_MS = 2600;

export interface MascotContextValue {
  state: MascotState;
  phrase: string | null;
  /** Play a state (and optionally show a phrase), then go back to idle. */
  react: (state: MascotState, phrase?: string, durationMs?: number) => void;
  /** Talk: mouth moves and the phrase shows in the bubble. */
  say: (phrase: string, durationMs?: number) => void;
  /** Pronounce English text with the browser's speech synthesis + talking animation. */
  speak: (text: string) => void;
  /** Back to idle immediately. */
  reset: () => void;
}

const MascotContext = createContext<MascotContextValue | null>(null);

export function useMascot(): MascotContextValue {
  const ctx = useContext(MascotContext);
  if (!ctx) {
    throw new Error("useMascot must be used inside <MascotProvider>.");
  }
  return ctx;
}

interface MascotProviderProps {
  children: ReactNode;
  /** Render the floating mascot in the bottom-right corner. Default: true. */
  widget?: boolean;
  /** Routes where the floating widget is hidden (e.g. ["/mascot-demo"]). */
  hideOn?: string[];
  /** Wave once per browser session on first load. Default: true. */
  greetOnLoad?: boolean;
}

export function MascotProvider({
  children,
  widget = true,
  hideOn = [],
  greetOnLoad = true,
}: MascotProviderProps) {
  const [state, setState] = useState<MascotState>("idle");
  const [phrase, setPhrase] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    stopSpeech();
    setState("idle");
    setPhrase(null);
  }, [clearTimer, stopSpeech]);

  const react = useCallback(
    (next: MascotState, text?: string, durationMs = DEFAULT_DURATION_MS) => {
      clearTimer();
      setState(next);
      setPhrase(text ?? null);
      if (next !== "idle") {
        timer.current = setTimeout(() => {
          setState("idle");
          setPhrase(null);
          timer.current = null;
        }, durationMs);
      }
    },
    [clearTimer],
  );

  const say = useCallback(
    (text: string, durationMs = DEFAULT_DURATION_MS) => react("talking", text, durationMs),
    [react],
  );

  const speak = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const canSpeak =
        typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        typeof SpeechSynthesisUtterance !== "undefined";
      if (!canSpeak) {
        say(trimmed, Math.max(DEFAULT_DURATION_MS, trimmed.length * 90));
        return;
      }
      clearTimer();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(trimmed);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      const finish = () => {
        setState("idle");
        setPhrase(null);
      };
      utterance.onstart = () => {
        setState("talking");
        setPhrase(trimmed);
      };
      utterance.onend = finish;
      utterance.onerror = finish;
      // Show the talking pose right away; some browsers delay `onstart`.
      setState("talking");
      setPhrase(trimmed);
      window.speechSynthesis.speak(utterance);
    },
    [clearTimer, say],
  );

  useEffect(
    () => () => {
      clearTimer();
      stopSpeech();
    },
    [clearTimer, stopSpeech],
  );

  const value = useMemo<MascotContextValue>(
    () => ({ state, phrase, react, say, speak, reset }),
    [state, phrase, react, say, speak, reset],
  );

  return (
    <MascotContext.Provider value={value}>
      {children}
      {widget ? <MascotWidget hideOn={hideOn} greetOnLoad={greetOnLoad} /> : null}
    </MascotContext.Provider>
  );
}

function MascotWidget({ hideOn, greetOnLoad }: { hideOn: string[]; greetOnLoad: boolean }) {
  const pathname = usePathname();
  const { state, phrase, react } = useMascot();
  const hidden = hideOn.includes(pathname);

  // Greet once per browser session, only while the widget is visible. The flag is
  // set inside the timeout so React Strict Mode's double effect run can't swallow it.
  useEffect(() => {
    if (!greetOnLoad || hidden) return;
    const t = setTimeout(() => {
      try {
        if (sessionStorage.getItem("milo-greeted")) return;
        sessionStorage.setItem("milo-greeted", "1");
      } catch {
        /* storage blocked: greet anyway */
      }
      react("wave", pick(GREETINGS), 2800);
    }, 700);
    return () => clearTimeout(t);
  }, [greetOnLoad, hidden, react]);

  if (hidden) return null;

  const onClick = () => {
    if (Math.random() < 0.5) {
      react("happy", pick(PRAISE));
    } else {
      react("wave", pick([...GREETINGS, ...INVITES]), 2800);
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-2 right-2 z-50 flex flex-col items-end sm:bottom-4 sm:right-4">
      <SpeechBubble phrase={phrase} />
      <button
        type="button"
        onClick={onClick}
        aria-label="Milo the kitten. Click to say hi."
        className="pointer-events-auto w-[92px] cursor-pointer rounded-full bg-transparent p-0 outline-none transition-transform focus-visible:ring-2 focus-visible:ring-orange-400 active:scale-95 sm:w-[140px]"
      >
        <Mascot state={state} className="h-auto w-full" />
      </button>
    </div>
  );
}
