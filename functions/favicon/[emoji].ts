import { parse } from "twemoji-parser";

interface Env {
  KV: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { emoji: encodedEmoji } = context.params;

  if (Array.isArray(encodedEmoji)) {
    return new Response("Page not found", { status: 404 });
  }

  const emoji = decodeURIComponent(encodedEmoji);
  const [twemoji] = parse(emoji);

  if (!twemoji) {
    return new Response("No emoji found", {
      status: 404,
    });
  } else {
    return fetch(twemoji.url);
  }
};
