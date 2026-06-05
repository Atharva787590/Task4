import { products } from "./data/products.js";

export async function fetchProducts() {
  return Promise.resolve(products);
}