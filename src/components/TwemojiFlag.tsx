"use client";

import { parse } from "twemoji-parser";

export function TwemojiFlag({
  emoji,
  size = 24,
  className = "",
  grayscale = false,
}: {
  emoji: string;
  size?: number;
  className?: string;
  grayscale?: boolean;
}) {
  const parsed = parse(emoji);
  if (parsed.length === 0) return <span>{emoji}</span>;

  return (
    <img
      src={parsed[0].url}
      alt={emoji}
      width={size}
      height={size}
      className={`inline-block ${grayscale ? "grayscale opacity-40" : ""} ${className}`}
      draggable={false}
    />
  );
}
