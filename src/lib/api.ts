import type {
  AnalyticsResponse,
  ChatRequest,
  ChatResponse,
  IndexingStatus,
  Product,
  RecommendationResponse,
  RecommendedProduct,
} from '@/types';

// ✅ Correct base URL (no markdown brackets)
const DEFAULT_BASE = 'https://0504ankitsharma-ikarus.hf.space';
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || DEFAULT_BASE;

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText} ${text}`);
  }
  return res.json() as Promise<T>;
}

// ✅ Health check
export async function health(): Promise<{ status: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
    return handle(res);
  } finally {
    clearTimeout(timeout);
  }
}

// ✅ Chat recommendations
export async function chatRecommendations(payload: ChatRequest): Promise<ChatResponse> {
  const lastUserMessage =
    [...payload.messages].reverse().find((m) => m.role === 'user')?.content ||
    payload.messages[payload.messages.length - 1]?.content ||
    '';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);

  try {
    const res = await fetch(`${API_BASE}/api/recommendations/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: lastUserMessage, top_k: payload.top_k ?? 3 }),
      signal: controller.signal,
    });
    return handle(res);
  } finally {
    clearTimeout(timeout);
  }
}

// ✅ Search recommendations
export async function searchRecommendations(query: string, top_k = 8): Promise<RecommendationResponse> {
  const res = await fetch(`${API_BASE}/api/recommendations/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, top_k }),
  });
  return handle(res);
}

// ✅ Similar products
export async function similarProducts(productId: string, top_k = 6): Promise<RecommendationResponse> {
  const res = await fetch(`${API_BASE}/api/recommendations/similar/${encodeURIComponent(productId)}?top_k=${top_k}`);
  return handle(res);
}

// ✅ Analytics summary
export async function analytics(): Promise<AnalyticsResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch(`${API_BASE}/api/analytics/`, { signal: controller.signal });
    return handle(res);
  } finally {
    clearTimeout(timeout);
  }
}

// ✅ Analytics products — FIXED return type
export async function analyticsProducts(): Promise<{ products: Product[]; total: number }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch(`${API_BASE}/api/analytics/products`, { signal: controller.signal });
    return handle(res);
  } finally {
    clearTimeout(timeout);
  }
}

// ✅ Indexing status
export async function indexingStatus(): Promise<IndexingStatus> {
  const res = await fetch(`${API_BASE}/indexing-status`);
  return handle(res);
}

// ✅ Helper functions
export function normalizeImages(images?: Product['images']): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return String(images)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function normalizeCategories(categories?: Product['categories']): string[] {
  if (!categories) return [];
  if (Array.isArray(categories)) return categories;
  try {
    const parsed = JSON.parse(categories);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return String(categories)
    .split('>')
    .flatMap((c) => c.split(','))
    .map((s) => s.trim())
    .filter(Boolean);
}

export function extractGenText(gen?: RecommendedProduct['generated_description']): string | undefined {
  if (!gen) return undefined;
  if (typeof gen === 'string') return gen;
  return gen.text;
}
