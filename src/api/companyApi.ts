import { API_URL, fetchWithAuth } from './api';

export interface Company {
  id: number;
  company_name: string;
  company_slug: string;
  contact_person: string;
  designation: string;
  phone_number: string;
  alternate_phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  logo_url: string;
  resolved_map_image_url: string;
  map_url: string;
  latitude: string | null;
  longitude: string | null;
  description: string;
  order: number;
}

export interface AdminCompany extends Company {
  map_image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type CompanyPayload = Omit<
  AdminCompany,
  'id' | 'resolved_map_image_url' | 'map_url' | 'created_at' | 'updated_at'
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
  } catch {
    // Fall through to the generic message below.
  }
  return `Request failed with status ${response.status}.`;
}

async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetchWithAuth(endpoint, options);
  if (!response.ok) throw new Error(await readError(response));
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function fetchCompanies(): Promise<Company[]> {
  const response = await fetch(`${API_URL}/home/companies/`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<Company[]>;
}

export const getAdminCompanies = () =>
  authenticatedRequest<AdminCompany[]>('/home/admin/companies/');

export const saveAdminCompany = (payload: CompanyPayload, id?: number) =>
  authenticatedRequest<AdminCompany>(
    id ? `/home/admin/companies/${id}/` : '/home/admin/companies/',
    {
      method: id ? 'PATCH' : 'POST',
      body: JSON.stringify(payload),
    },
  );

export const deleteAdminCompany = (id: number) =>
  authenticatedRequest<void>(`/home/admin/companies/${id}/`, {
    method: 'DELETE',
  });
