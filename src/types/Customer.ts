import { BASE_URL } from "./All";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  initials: string;
}

export const API_URL_CUSTOMER = `${BASE_URL}/customers`;
