declare module "twemoji-parser" {
  interface EmojiEntity {
    url: string;
    indices: [number, number];
    text: string;
    type: string;
  }
  export function parse(text: string, options?: Record<string, unknown>): EmojiEntity[];
}
