// All communication with the Witcher Fandom wiki (MediaWiki API) lives here.
// Components never call fetch directly; they use these functions through hooks.

const BASE_URL = "https://witcher.fandom.com/api.php";
const PAGE_SIZE = 24;

/** Titles that are list/overview pages rather than real entries. */
const NOISE = /^(The Witcher \d? ?(bestiary|beasts|bosses|characters)|List of )|\(disambiguation\)|:/i;

/** Build a URL with the common params and fetch JSON. Throws on HTTP or API errors. */
async function request(params, { signal } = {}) {
  const url = new URL(BASE_URL);
  Object.entries({ format: "json", origin: "*", ...params }).forEach(([k, v]) =>
    url.searchParams.set(k, v),
  );
  let res;
  try {
    res = await fetch(url, { signal });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("Could not reach the Witcher Wiki. Check your connection and try again.");
  }
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const data = await res.json();
  if (data.error) {
    const err = new Error(data.error.info || "The wiki returned an error.");
    err.code = data.error.code;
    throw err;
  }
  return data;
}

/** One page of a category's members, plus the token for "Load more". */
export async function getCategoryPage(category, cont, { signal } = {}) {
  const data = await request(
    {
      action: "query",
      list: "categorymembers",
      cmtitle: category,
      cmtype: "page",
      cmlimit: PAGE_SIZE,
      ...(cont && { cmcontinue: cont }),
    },
    { signal },
  );
  return {
    titles: data.query.categorymembers.map((m) => m.title).filter((t) => !NOISE.test(t)),
    next: data.continue?.cmcontinue ?? null,
  };
}

/** Remove reference markers like [3] and tidy whitespace. */
function cleanText(text = "") {
  return text.replace(/\[\d+\]|\[[a-z ]+\]/gi, "").replace(/\s+/g, " ").trim();
}

/**
 * Thumbnails + short summaries for many titles at once (max 50 per call).
 * Fandom has no `extracts`, so the summary comes from `pageprops.fandomdescription`.
 * Redirected titles are followed, and results keep the requested order.
 */
export async function getPreviews(titles, { signal } = {}) {
  if (!titles.length) return [];
  const data = await request(
    {
      action: "query",
      titles: titles.join("|"),
      prop: "pageimages|pageprops",
      piprop: "thumbnail",
      pithumbsize: 400,
      pilimit: "max",
      ppprop: "fandomdescription",
      redirects: 1,
    },
    { signal },
  );
  const q = data.query ?? {};
  const renamed = new Map();
  [...(q.normalized ?? []), ...(q.redirects ?? [])].forEach((r) => renamed.set(r.from, r.to));
  const pages = new Map(Object.values(q.pages ?? {}).map((p) => [p.title, p]));

  return titles
    .map((requested) => {
      let title = requested;
      for (let i = 0; i < 3 && renamed.has(title); i++) title = renamed.get(title);
      const page = pages.get(title);
      if (!page || page.missing !== undefined) return null;
      return {
        title,
        image: page.thumbnail?.source ?? null,
        summary: cleanText(page.pageprops?.fandomdescription),
      };
    })
    .filter(Boolean);
}

/** Full page → parsed into { title, image, facts, sections }. */
export async function getPage(title, { signal } = {}) {
  const data = await request(
    { action: "parse", page: title, prop: "text", redirects: 1 },
    { signal },
  );
  return parseWikiHtml(data.parse.title, data.parse.text["*"]);
}

/** Search the wiki's articles by text; returns matching titles. */
export async function searchWiki(query, { signal } = {}) {
  const data = await request(
    { action: "query", list: "search", srsearch: query, srnamespace: 0, srlimit: 20 },
    { signal },
  );
  return data.query.search.map((r) => r.title).filter((t) => !t.includes("(disambiguation)"));
}

/** Read an <img> URL; Fandom lazy-loads images with data-src and a placeholder src. */
function imageUrl(img) {
  if (!img) return null;
  const src = img.getAttribute("src");
  return img.getAttribute("data-src") || (src && !src.startsWith("data:") ? src : null);
}

/**
 * Turn wiki HTML into safe plain data. We never inject the raw HTML into the page
 * (no dangerouslySetInnerHTML); we only read text and image URLs from it.
 */
function parseWikiHtml(title, html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("sup.reference, .mw-editsection, style, script").forEach((n) => n.remove());

  const infobox = doc.querySelector(".portable-infobox");
  const image = imageUrl(infobox?.querySelector(".pi-image img") ?? infobox?.querySelector("img"));
  const seen = new Set();
  const facts = [...(infobox?.querySelectorAll(".pi-data") ?? [])]
    .map((row) => ({
      label: cleanText(row.querySelector(".pi-data-label")?.textContent),
      value: cleanText(row.querySelector(".pi-data-value")?.textContent),
    }))
    .filter((f) => f.label && f.value && !seen.has(f.label) && seen.add(f.label));

  // Walk the top-level content and group paragraphs under their <h2> heading.
  const root = doc.querySelector(".mw-parser-output") ?? doc.body;
  const sections = [{ heading: null, paragraphs: [] }];
  for (const node of root.children) {
    if (node.tagName === "H2") {
      sections.push({ heading: cleanText(node.textContent), paragraphs: [] });
    } else if (node.tagName === "P") {
      const text = cleanText(node.textContent);
      if (text.length > 40) sections.at(-1).paragraphs.push(text);
    }
  }

  return { title, image, facts, sections: sections.filter((s) => s.paragraphs.length).slice(0, 6) };
}
