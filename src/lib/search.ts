import { blogPosts } from "@/data/blogs";
import { experiences } from "@/data/experiences";
import { projects } from "@/data/projects";
import { suggestions } from "@/data/suggestions";

const SEARCH_ALIASES: Record<string, string[]> = {
  ai: ["anthropic", "llm", "machine learning", "recommendation"],
  api: ["rest", "restful", "canvas", "backend", "endpoint"],
  backend: ["api", "spring", "node", "express", "supabase", "convex"],
  chess: ["speechrecognizer", "whisper", "voice"],
  frontend: ["react", "next", "nextjs", "typescript", "tailwind"],
  hackathon: ["cutie", "12-hour", "bitwizards", "blockly"],
  llm: ["anthropic", "ai"],
  ml: ["machine learning", "svm", "knn", "classification", "regression"],
  next: ["next.js", "nextjs", "react"],
  nextjs: ["next", "next.js", "react"],
  python: ["numpy", "pandas", "svm", "knn", "speechrecognizer"],
  react: ["frontend", "next", "nextjs"],
  resume: ["experience", "projects", "skills"],
  study: ["study spot", "school documents", "canvas", "llamaparse"],
  bitwizards: ["vercel", "fantasy", "nextjs", "blockly", "cutie"],
  blockly: ["bitwizards", "educational", "javascript"],
};

interface SearchOptions<T> {
  getText: (item: T) => string[];
}

interface RankedItem<T> {
  item: T;
  score: number;
  index: number;
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ");
}

function normalize(value: string) {
  return stripHtml(value)
    .toLowerCase()
    .replace(/next\s*\.?\s*js/g, "nextjs")
    .replace(/c\+\+/g, "cpp")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function tokenize(value: string) {
  return normalize(value).split(" ").filter(Boolean);
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function includesName(value: string) {
  const tokens = tokenize(value);
  return tokens.includes("david") || tokens.includes("vayntrub");
}

function stripPersonalName(value: string) {
  return stripHtml(value)
    .replace(/\bdavid\s+vayntrub\b/gi, " ")
    .replace(/\bdvayn\b/gi, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function expandQueryTokens(tokens: string[]) {
  return unique(
    tokens.flatMap((token) => [
      token,
      ...(SEARCH_ALIASES[token] ?? []).flatMap((alias) => tokenize(alias)),
    ])
  );
}

function editDistanceWithin(left: string, right: string, maxDistance: number) {
  if (Math.abs(left.length - right.length) > maxDistance) {
    return maxDistance + 1;
  }

  let previous = Array.from({ length: right.length + 1 }, (_, i) => i);

  for (let i = 1; i <= left.length; i += 1) {
    const current = [i];
    let rowMin = current[0];

    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      const value = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + cost
      );

      current[j] = value;
      rowMin = Math.min(rowMin, value);
    }

    if (rowMin > maxDistance) {
      return maxDistance + 1;
    }

    previous = current;
  }

  return previous[right.length];
}

function scoreToken(queryToken: string, contentTokens: string[]) {
  let bestScore = 0;

  for (const contentToken of contentTokens) {
    if (contentToken === queryToken) {
      bestScore = Math.max(bestScore, 12);
    } else if (contentToken.startsWith(queryToken) && queryToken.length >= 2) {
      bestScore = Math.max(bestScore, 8);
    } else if (queryToken.startsWith(contentToken) && contentToken.length >= 3) {
      bestScore = Math.max(bestScore, 5);
    } else if (queryToken.length >= 4) {
      const maxDistance = queryToken.length <= 6 ? 1 : 2;
      const distance = editDistanceWithin(queryToken, contentToken, maxDistance);

      if (distance <= maxDistance) {
        bestScore = Math.max(bestScore, distance === 1 ? 6 : 4);
      }
    }
  }

  return bestScore;
}

function scoreText(query: string, queryTokens: string[], textParts: string[]) {
  const normalizedText = normalize(textParts.join(" "));
  const contentTokens = tokenize(normalizedText);
  const expandedTokens = expandQueryTokens(queryTokens);

  let score = 0;

  if (normalizedText.includes(query)) {
    score += query.includes(" ") ? 30 : 16;
  }

  for (const token of queryTokens) {
    score += scoreToken(token, contentTokens);
  }

  for (const token of expandedTokens) {
    if (!queryTokens.includes(token)) {
      score += scoreToken(token, contentTokens) * 0.45;
    }
  }

  return score;
}

function addCandidate(candidates: string[], value: string | undefined) {
  if (!value) {
    return;
  }

  const cleaned = stripHtml(value).trim();
  if (cleaned) {
    candidates.push(cleaned);
  }
}

export function getSearchKeywordCandidates() {
  const candidates: string[] = [];

  for (const suggestion of suggestions) {
    addCandidate(candidates, stripPersonalName(suggestion));
    addCandidate(candidates, suggestion);
  }

  for (const project of projects) {
    addCandidate(candidates, project.title);
    addCandidate(candidates, project.url);
    addCandidate(candidates, project.snippet);
    addCandidate(candidates, project.details);
    for (const tag of project.tags) {
      addCandidate(candidates, tag);
    }
  }

  for (const experience of experiences) {
    addCandidate(candidates, experience.title);
    addCandidate(candidates, experience.url);
    addCandidate(candidates, experience.snippet);
    addCandidate(candidates, experience.details);
  }

  for (const post of blogPosts) {
    addCandidate(candidates, post.title);
    addCandidate(candidates, post.url);
    addCandidate(candidates, post.snippet);
    addCandidate(candidates, post.details);
    for (const tag of post.tags) {
      addCandidate(candidates, tag);
    }
  }

  const seen = new Set<string>();
  return candidates.filter((candidate) => {
    const normalized = normalize(candidate);
    if (!normalized || seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);
    return true;
  });
}

export function matchVoiceQuery(transcript: string, candidates: string[]) {
  const normalizedTranscript = normalize(transcript);

  if (!normalizedTranscript) {
    return "";
  }

  const transcriptTokens = tokenize(normalizedTranscript);
  const minimumScore = Math.max(10, transcriptTokens.length * 5);
  const transcriptIncludesName = includesName(normalizedTranscript);
  let bestCandidate = transcript.trim();
  let bestScore = 0;
  let bestCandidateIncludesName = false;

  for (const candidate of candidates) {
    const score = scoreText(normalizedTranscript, transcriptTokens, [candidate]);
    const candidateIncludesName = includesName(candidate);

    if (
      score > bestScore ||
      (score === bestScore &&
        bestCandidateIncludesName &&
        !candidateIncludesName &&
        !transcriptIncludesName)
    ) {
      bestScore = score;
      bestCandidate = candidate;
      bestCandidateIncludesName = candidateIncludesName;
    }
  }

  if (bestScore < minimumScore) {
    return transcript.trim();
  }

  if (!transcriptIncludesName && bestCandidateIncludesName) {
    return transcript.trim();
  }

  return bestCandidate;
}

// Short, human-phrased topics that aren't literal titles/tags but that people
// actually type. Ranked alongside the data-derived pool below.
const TOPIC_SUGGESTIONS = [
  "projects",
  "experience",
  "resume",
  "contact",
  "skills",
  "machine learning",
  "voice search",
  "self-moving chess set",
  "hackathon projects",
  "ai overview",
  "full stack developer",
];

// Built once from the same data the results render from, so recommendations can
// never drift from the site's actual content.
let suggestionPool: string[] | null = null;

function buildSuggestionPool(): string[] {
  if (suggestionPool) {
    return suggestionPool;
  }

  const pool: string[] = [...suggestions, ...TOPIC_SUGGESTIONS];

  for (const project of projects) {
    pool.push(project.title, ...project.tags);
  }
  for (const experience of experiences) {
    pool.push(experience.title);
  }
  for (const post of blogPosts) {
    pool.push(post.title, ...post.tags);
  }

  const seen = new Set<string>();
  suggestionPool = pool.filter((candidate) => {
    const key = normalize(candidate);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  return suggestionPool;
}

/**
 * Ranked autocomplete recommendations for the search box. Unlike a plain
 * substring filter over a fixed name list, this scores a pool built from the
 * live corpus (projects, experience, tags, topics) with the same fuzzy matcher
 * the results use — so typing a topic like "chess", "react", or "ml" actually
 * surfaces relevant recommendations instead of an empty dropdown.
 */
export function getSuggestions(value: string, limit = 8): string[] {
  const normalizedValue = normalize(value);

  // Empty box: show the canonical name-based searches, like Google's recents.
  if (!normalizedValue) {
    return suggestions.slice(0, Math.min(limit, 6));
  }

  const valueTokens = tokenize(normalizedValue);
  const pool = buildSuggestionPool();

  const ranked = pool
    .map((candidate, index) => {
      const normalizedCandidate = normalize(candidate);
      let score = scoreText(normalizedValue, valueTokens, [candidate]);

      // Prefix/substring boosts make it feel like classic autocomplete: what
      // you're literally typing floats to the top.
      if (normalizedCandidate.startsWith(normalizedValue)) {
        score += 20;
      } else if (normalizedCandidate.includes(` ${normalizedValue}`)) {
        score += 12;
      } else if (normalizedCandidate.includes(normalizedValue)) {
        score += 8;
      }

      return { candidate, score, index };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, limit)
    .map(({ candidate }) => candidate);

  // Degrade gracefully to a substring match if nothing scored (very rare).
  if (ranked.length === 0) {
    const needle = value.toLowerCase();
    return suggestions.filter((s) => s.toLowerCase().includes(needle));
  }

  return ranked;
}

export function searchItems<T>(items: T[], query: string, options: SearchOptions<T>) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return items;
  }

  const queryTokens = tokenize(normalizedQuery);
  const rankedItems: RankedItem<T>[] = items
    .map((item, index) => ({
      item,
      index,
      score: scoreText(normalizedQuery, queryTokens, options.getText(item)),
    }))
    .filter(({ score }) => score >= Math.max(5, queryTokens.length * 4))
    .sort((left, right) => right.score - left.score || left.index - right.index);

  return rankedItems.map(({ item }) => item);
}
