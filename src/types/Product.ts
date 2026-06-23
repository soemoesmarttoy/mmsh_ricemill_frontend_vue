import { BASE_URL } from "./All";

export interface Product {
  id: string;
  name: string;
  category1: string;
  category2: string;
  category3: string;
  category4: string;
}

export const API_URL_PRODUCT = `${BASE_URL}/products`;
