# content-negotiation

HTTP Accept header negotiation with q-values, specificity ordering, and media-type matching per RFC 9110.

## Quick Start

```typescript
import { parseAccept, negotiate } from "content-negotiation";

const accept = "text/html, application/json;q=0.9";
const available = ["text/html", "application/json", "text/plain"];

const best = negotiate(accept, available); // → "text/html"
```

## API

### `parseAccept(header: string): MediaType[]`

Parse Accept header; returns sorted by specificity then q-value.

Specificity: exact type/subtype > type/* > */*

### `parseAcceptLanguage(header: string): ParsedLanguage[]`

Parse Accept-Language header; sorted by q-value.

### `negotiate(acceptHeader: string, available: string[]): string | null`

Find best match from available options, or null if none match.

## Limits

- Parameters parsed but not matched during negotiation
- No Accept-Encoding or Accept-Charset (extend with parseAccept)
- Language subtags not matched (exact match only)

---

Part of the [ferrow-toolkit](https://github.com/Ruzylo-cloud/ferrow-toolkit) collection · Sponsored by [Ferrow](https://ferrow.ai)
