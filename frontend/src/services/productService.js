const API_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path) {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error("Product request failed");
  return response.json();
}

export function getProducts(options = {}) {
  const params = new URLSearchParams();

  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return request(`/products${query ? `?${query}` : ""}`);
}

export function getProductById(id) {
  return request(`/products/${id}`);
}

export function getSimilarProducts(product) {
  if (!product?.id) return Promise.resolve([]);
  return request(`/products/${product.id}/similar`);
}

export function filterProducts(filters) {
  return getProducts(filters);
}
