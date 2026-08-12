export interface MediaType {
  type: string;
  subtype: string;
  quality: number;
  parameters?: Record<string, string>;
}

export interface ParsedLanguage {
  lang: string;
  quality: number;
}

function parseQValue(qStr: string): number {
  if (!qStr.startsWith("q=")) return 1;
  const val = parseFloat(qStr.substring(2));
  return isNaN(val) ? 1 : Math.max(0, Math.min(1, val));
}

export function parseAccept(header: string): MediaType[] {
  const types: MediaType[] = [];
  const parts = header.split(",");

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const segments = trimmed.split(";");
    const typeStr = segments[0].trim();

    if (!typeStr.includes("/")) continue;

    const [type, subtype] = typeStr.split("/");
    let quality = 1;
    const parameters: Record<string, string> = {};

    for (let i = 1; i < segments.length; i++) {
      const seg = segments[i].trim();
      if (seg.startsWith("q=")) {
        quality = parseQValue(seg);
      } else {
        const eqIdx = seg.indexOf("=");
        if (eqIdx !== -1) {
          const key = seg.substring(0, eqIdx).trim();
          const val = seg.substring(eqIdx + 1).trim().replace(/^"(.*)"$/, "$1");
          parameters[key] = val;
        }
      }
    }

    if (quality > 0) {
      types.push({ type, subtype, quality, parameters });
    }
  }

  // Sort by specificity (exact > subtype wildcard > full wildcard), then by q-value
  types.sort((a, b) => {
    const specA = (a.type !== "*" ? 1 : 0) + (a.subtype !== "*" ? 1 : 0);
    const specB = (b.type !== "*" ? 1 : 0) + (b.subtype !== "*" ? 1 : 0);
    if (specA !== specB) return specB - specA;
    return b.quality - a.quality;
  });

  return types;
}

export function parseAcceptLanguage(header: string): ParsedLanguage[] {
  const langs: ParsedLanguage[] = [];
  const parts = header.split(",");

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const segments = trimmed.split(";");
    const lang = segments[0].trim().toLowerCase();
    let quality = 1;

    if (segments.length > 1 && segments[1].startsWith("q=")) {
      quality = parseQValue(segments[1]);
    }

    if (quality > 0) {
      langs.push({ lang, quality });
    }
  }

  langs.sort((a, b) => b.quality - a.quality);
  return langs;
}

export function negotiate(
  acceptHeader: string,
  available: string[]
): string | null {
  const types = parseAccept(acceptHeader);

  for (const accepted of types) {
    for (const avail of available) {
      const [availType, availSubtype] = avail.split("/");

      if (
        (accepted.type === availType || accepted.type === "*") &&
        (accepted.subtype === availSubtype || accepted.subtype === "*")
      ) {
        return avail;
      }
    }
  }

  return null;
}

export default { parseAccept, parseAcceptLanguage, negotiate };
