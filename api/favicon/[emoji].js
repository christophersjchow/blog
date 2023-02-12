import { parse } from "twemoji-parser";
import fetch from "node-fetch";

export default function handler(request, response) {
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
