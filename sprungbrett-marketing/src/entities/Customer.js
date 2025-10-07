// src/entities/Customer.js
const BASE = "/api/Customer";

async function http(url, opts) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export const Customer = {
  list: (sort) => http(`${BASE}${sort ? `?sort=${encodeURIComponent(sort)}` : ""}`),
  filter: (query) =>
    http(`${BASE}/filter`, { method: "POST", body: JSON.stringify(query) }),
  create: (data) => http(BASE, { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    http(`${BASE}/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id) => http(`${BASE}/${id}`, { method: "DELETE" }),
};

export default Customer;
