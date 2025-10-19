export type ImageURL = string;

export interface Product {
  uniq_id: string;
  title: string;
  brand?: string;
  description?: string;
  price?: number;
  categories?: string[] | string;
  images?: ImageURL[] | string;
  manufacturer?: string;
  package_dimensions?: string;
  country_of_origin?: string;
  material?: string;
  color?: string;
}

export interface GeneratedDescription {
  model?: string;
  text: string;
}

export interface RecommendedProduct {
  product: Product;
  score?: number;
  generated_description?: GeneratedDescription | string;
}

export interface RecommendationResponse {
  items: RecommendedProduct[];
}

export type Role = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  top_k?: number;
}

export interface ChatResponse {
  reply?: string;
  recommendations?: RecommendedProduct[];
}

export interface AnalyticsResponse {
  total_products?: number;
  avg_price?: number;
  brands_count?: number;
  category_counts?: Record<string, number>;
  material_counts?: Record<string, number>;
  color_counts?: Record<string, number>;
  price_statistics?: {
    mean?: number;
    median?: number;
    min?: number;
    max?: number;
  };
  top_brands?: Array<{ brand: string; count: number }>;
}

export interface IndexingStatus {
  status: string;
  indexed?: number;
  total?: number;
  detail?: string;
}