import { parse } from "twemoji-parser";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { emoji: encodedEmoji } = request.query;

  if (Array.isArray(encodedEmoji)) {
    return response.status(404);
  }

  const emoji = decodeURIComponent(encodedEmoji);
  const [twemoji] = parse(emoji);

  if (!twemoji) {
    return response.status(404);
  } else {
    return fetch(twemoji.url);
  }
}
