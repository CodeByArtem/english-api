# Milo the Kitten (mascot)

A pure inline-SVG cartoon mascot animated with Framer Motion. No images, no JSON files.

## Install

```bash
npm install framer-motion
```

Files go to `components/Mascot/` and `app/mascot-demo/page.tsx`.
The demo page imports from `@/components/Mascot` (the default Next.js `@/*` alias).

## Add to the layout

`app/layout.tsx` stays a server component; the provider is a client component and can be used inside it:

```tsx
import { MascotProvider } from "@/components/Mascot";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MascotProvider hideOn={["/mascot-demo"]}>{children}</MascotProvider>
      </body>
    </html>
  );
}
```

That gives you the floating Milo in the bottom-right corner on every page:
he waves once per browser session, and clicking him triggers a random reaction.

Provider props: `widget` (default `true`), `hideOn` (routes without the floating widget), `greetOnLoad` (default `true`).

## Control him from any client component

```tsx
"use client";
import { useMascot } from "@/components/Mascot";

function Quiz() {
  const mascot = useMascot();

  return (
    <>
      <button onClick={() => mascot.react("happy", "Great job!")}>Correct</button>
      <button onClick={() => mascot.react("sad", "Try again!")}>Wrong</button>
      <button onClick={() => mascot.speak("apple")}>Pronounce</button>
    </>
  );
}
```

| Method | What it does |
| --- | --- |
| `react(state, phrase?, ms?)` | Plays a state, shows an optional bubble, returns to idle after `ms` (default 2600) |
| `say(phrase, ms?)` | Talking animation + bubble |
| `speak(text)` | Pronounces English text with the Web Speech API (en-US) while the mouth moves |
| `reset()` | Back to idle immediately |

## Use the character alone

```tsx
import { Mascot } from "@/components/Mascot";

<Mascot state="thinking" size={200} />
```

States: `idle`, `happy`, `sad`, `thinking`, `talking`, `wave`.

## Notes

- `prefers-reduced-motion`: loops and sparkles are turned off, each state shows a static pose.
- SSR safe: the first render is always the idle pose; nothing random runs during render.
- The floating widget uses Tailwind classes. Without Tailwind, replace the classes in `MascotProvider.tsx` and `SpeechBubble.tsx`.
- Colors live in the `C` object at the top of `Mascot.tsx`. Animation timings live in `variants.ts`.
