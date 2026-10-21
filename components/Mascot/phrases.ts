export const GREETINGS = ["Hello!", "Hi there!", "Welcome back!"] as const;
export const PRAISE = ["Great job!", "Well done!", "Awesome!", "You did it!"] as const;
export const ENCOURAGE = ["Try again!", "Almost there!", "You can do it!"] as const;
export const INVITES = ["Let's learn!", "Ready to practice?", "Let's go!"] as const;

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
