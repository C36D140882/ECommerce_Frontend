import { fetchWithAuth } from './api';
import type {
  Advertisement,
  Category,
  HomeSection,
  HomeSectionProduct,
} from './homeApi';

export interface AdminAdvertisement extends Advertisement {
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminCategory extends Category {
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminHomeSectionProduct extends HomeSectionProduct {
  section: number;
  section_title: string;
}

export interface AdminHomeSection extends Omit<HomeSection, 'products'> {
  is_active: boolean;
  products: AdminHomeSectionProduct[];
  created_at: string;
  updated_at: string;
}

export type AdvertisementPayload = Omit<
  AdminAdvertisement,
  'id' | 'created_at' | 'updated_at'
>;

export type CategoryPayload = Omit<
  AdminCategory,
  'id' | 'created_at' | 'updated_at'
>;

export type HomeSectionPayload = Omit<
  AdminHomeSection,
  'id' | 'products' | 'created_at' | 'updated_at'
>;

export type HomeProductPayload = Omit<
  AdminHomeSectionProduct,
  'id' | 'section_title'
>;

async function readError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data?.detail === 'string') return data.detail;

    const firstKey = Object.keys(data ?? {})[0];
    const firstValue = firstKey ? data[firstKey] : null;
    if (Array.isArray(firstValue) && firstValue.length) {
      return `${firstKey}: ${String(firstValue[0])}`;
    }
    if (typeof firstValue === 'string') return `${firstKey}: ${firstValue}`;
    return 'Request failed. Please check the entered values.';
  } catch {
    return `Request failed with status ${response.status}.`;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetchWithAuth(endpoint, options);
  if (!response.ok) throw new Error(await readError(response));
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function save<TPayload, TResult>(
  endpoint: string,
  payload: TPayload,
  id?: number,
): Promise<TResult> {
  return request<TResult>(id ? `${endpoint}${id}/` : endpoint, {
    method: id ? 'PATCH' : 'POST',
    body: JSON.stringify(payload),
  });
}

export const getAdminAdvertisements = () =>
  request<AdminAdvertisement[]>('/home/admin/advertisements/');

export const saveAdminAdvertisement = (payload: AdvertisementPayload, id?: number) =>
  save<AdvertisementPayload, AdminAdvertisement>('/home/admin/advertisements/', payload, id);

export const deleteAdminAdvertisement = (id: number) =>
  request<void>(`/home/admin/advertisements/${id}/`, { method: 'DELETE' });

export const getAdminCategories = () =>
  request<AdminCategory[]>('/home/admin/categories/');

export const saveAdminCategory = (payload: CategoryPayload, id?: number) =>
  save<CategoryPayload, AdminCategory>('/home/admin/categories/', payload, id);

export const deleteAdminCategory = (id: number) =>
  request<void>(`/home/admin/categories/${id}/`, { method: 'DELETE' });

export const getAdminHomeSections = () =>
  request<AdminHomeSection[]>('/home/admin/sections/');

export const saveAdminHomeSection = (payload: HomeSectionPayload, id?: number) =>
  save<HomeSectionPayload, AdminHomeSection>('/home/admin/sections/', payload, id);

export const deleteAdminHomeSection = (id: number) =>
  request<void>(`/home/admin/sections/${id}/`, { method: 'DELETE' });

export const getAdminHomeProducts = () =>
  request<AdminHomeSectionProduct[]>('/home/admin/products/');

export const saveAdminHomeProduct = (payload: HomeProductPayload, id?: number) =>
  save<HomeProductPayload, AdminHomeSectionProduct>('/home/admin/products/', payload, id);

export const deleteAdminHomeProduct = (id: number) =>
  request<void>(`/home/admin/products/${id}/`, { method: 'DELETE' });
