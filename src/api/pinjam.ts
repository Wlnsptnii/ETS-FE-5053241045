
const API_URL = "http://localhost:8080";

export interface SumberDaya {
  id: number;
  nama: string;
  jenis: "ruang" | "alat";
  stok: number;
}

export interface Peminjaman {
  id: number;
  sumber_daya_id: number;
  peminjam: string;
  tanggal: string;
  slot_mulai: number;
  slot_selesai: number;
  jumlah: number;
  status: string;
}

export interface InputSumberDaya {
  nama: string;
  jenis: "ruang" | "alat";
  stok: number;
}

export interface InputPeminjaman {
  sumber_daya_id: number;
  peminjam: string;
  tanggal: string;
  slot_mulai: number;
  slot_selesai: number;
  jumlah: number;
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function ambilSumberDaya() {
  return request<SumberDaya[]>("/sumber-daya");
}

export function buatSumberDaya(data: InputSumberDaya) {
  return request<SumberDaya>("/sumber-daya", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function ambilPeminjaman(filters: {
  sumber_daya_id?: string;
  tanggal?: string;
  status?: string;
} = {}) {
  const params = new URLSearchParams();

  if (filters.sumber_daya_id) {
    params.set("sumber_daya_id", filters.sumber_daya_id);
  }
  if (filters.tanggal) params.set("tanggal", filters.tanggal);
  if (filters.status) params.set("status", filters.status);

  const query = params.toString();
  return request<Peminjaman[]>(
    `/peminjaman${query ? `?${query}` : ""}`
  );
}

export function buatPeminjaman(data: InputPeminjaman) {
  return request<Peminjaman>("/peminjaman", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function detailPeminjaman(id: number) {
  return request<Peminjaman>(`/peminjaman/${id}`);
}
