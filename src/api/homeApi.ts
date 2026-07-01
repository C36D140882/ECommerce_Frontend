import { API_URL } from './api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Advertisement {
  id: number;
  title: string;
  subtitle: string;
  badge_text: string;
  discount_text: string;
  description: string;
  button_text: string;
  button_link: string;
  bg_color: string;
  image_url: string;
  order: number;
}

export interface Category {
  id: number;
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  description: string;
  order: number;
}

export interface HomeSectionProduct {
  id: number;
  name: string;
  description: string;
  image_url: string;
  order: number;
}

export interface HomeSection {
  id: number;
  title: string;
  section_key: string;
  category_link_id: string | null;
  order: number;
  products: HomeSectionProduct[];
}

// ─── Public fetch helpers (no auth required) ─────────────────────────────────

async function publicGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

// ─── API Functions ────────────────────────────────────────────────────────────

/** Fetch all active advertisements (hero banner slides). */
export async function fetchAdvertisements(): Promise<Advertisement[]> {
  return publicGet<Advertisement[]>('/home/advertisements/');
}

/** Fetch all active categories (used for category chips & sidebar). */
export async function fetchCategories(): Promise<Category[]> {
  return publicGet<Category[]>('/home/categories/');
}

/** Fetch all active home sections with their nested products. */
export async function fetchHomeSections(): Promise<HomeSection[]> {
  return publicGet<HomeSection[]>('/home/sections/');
}
