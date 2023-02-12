import { parse } from "twemoji-parser";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async function handler(
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
    const svg = await fetch(twemoji.url);
    const body = await svg.buffer();
    return response
      .status(200)
      .setHeader("content-type", "image/svg+xml")
      .send(body);
  }
}
