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
