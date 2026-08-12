const { parseAccept, parseAcceptLanguage, negotiate } = require("../dist/index");

// Demo: parse browser-realistic Accept header
const accept =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
const parsed = parseAccept(accept);
console.log("Parsed Accept header (first 3):");
parsed.slice(0, 3).forEach((t) => {
  console.log(`  ${t.type}/${t.subtype} q=${t.quality}`);
});

// Demo: q=0 exclusion
const withExclude = "text/html, application/json;q=0, */*;q=0.1";
const parsed2 = parseAccept(withExclude);
console.log(
  "\nWith q=0 exclusion (application/json excluded):",
  parsed2.some((t) => t.type === "application" && t.subtype === "json")
);

// Demo: negotiation
const mediaTypes = ["text/html", "application/json", "application/xml"];
const best = negotiate(accept, mediaTypes);
console.log("\nBest match for browser Accept:", best);

// Demo: Accept-Language
const acceptLang = "en-US,en;q=0.9,fr;q=0.8";
const langs = parseAcceptLanguage(acceptLang);
console.log("\nParsed Accept-Language:");
langs.forEach((l) => {
  console.log(`  ${l.lang} q=${l.quality}`);
});

// Demo: specificity ordering
const specific =
  "application/json, application/*;q=0.9, */*;q=0.8";
const parsed3 = parseAccept(specific);
console.log(
  "\nSpecificity order (json > app/* > */*):",
  parsed3.map((t) => `${t.type}/${t.subtype}`).join(" > ")
);
