"use client";

import { useState } from "react";
import { ENCOURAGE, GREETINGS, INVITES, Mascot, MASCOT_STATES, PRAISE, pick, useMascot } from "@/components/Mascot";
import type { MascotState } from "@/components/Mascot";

const STATE_PHRASES: Record<MascotState, string | undefined> = {
  idle: undefined,
  happy: pick(PRAISE),
  sad: pick(ENCOURAGE),
  thinking: "Hmm...",
  talking: "Let's learn!",
  wave: pick(GREETINGS),
};

const QUICK_PHRASES = Array.from(new Set(["Hello!", "Great job!", "Try again!", "Well done!", ...INVITES]));

export default function MascotDemoPage() {
  const { state, react, say, speak, reset } = useMascot();
  const [text, setText] = useState("Good morning!");

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Milo the Kitten</h1>
      <p className="mt-1 text-slate-600">Mascot demo: try every state, or make Milo say anything.</p>

      <section className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
        <div className="flex min-w-0 flex-col items-center rounded-3xl bg-orange-50 p-6">
          <Mascot state={state} size={260} className="h-auto w-full max-w-[260px]" />
          <p className="mt-2 text-sm font-medium text-slate-600">
            state: <code className="rounded bg-white px-2 py-0.5">{state}</code>
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-slate-800">States</h2>
            <div className="flex flex-wrap gap-2">
              {MASCOT_STATES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => (s === "idle" ? reset() : react(s, STATE_PHRASES[s], 4000))}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    state === s ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-800 hover:bg-orange-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-semibold text-slate-800">Say anything</h2>
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && say(text, 3500)}
                placeholder="Type an English phrase"
                className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-orange-400"
              />
              <button
                type="button"
                onClick={() => say(text, 3500)}
                className="rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600"
              >
                Say
              </button>
              <button
                type="button"
                onClick={() => speak(text)}
                className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-white hover:bg-slate-900"
              >
                Pronounce
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_PHRASES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setText(p)}
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              &quot;Pronounce&quot; uses the browser&apos;s speech synthesis (en-US) and animates the mouth while it speaks.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-3 font-semibold text-slate-800">All states at once</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {MASCOT_STATES.map((s) => (
            <div key={s} className="flex min-w-0 flex-col items-center rounded-2xl bg-orange-50 p-3 sm:p-4">
              <Mascot state={s} size={150} className="h-auto w-full max-w-[150px]" />
              <span className="mt-1 text-sm font-semibold text-slate-700">{s}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
