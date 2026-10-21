
import { useCallback, useEffect, useState } from "react";
import {
  ambilSumberDaya,
  buatSumberDaya,
  ambilPeminjaman,
  buatPeminjaman,
  detailPeminjaman,
  type SumberDaya,
  type Peminjaman,
  type InputSumberDaya,
  type InputPeminjaman,
} from "./api/pinjam";

import SumberDayaComponent from "./components/SumberDaya";
import FormPeminjaman from "./components/FormPeminjaman";
import DaftarPeminjaman from "./components/DaftarPeminjaman";
import "./App.css";

type Filters = {
  sumber_daya_id?: string;
  tanggal?: string;
  status?: string;
};

export default function App() {
  const [sumberDaya, setSumberDaya] = useState<SumberDaya[]>([]);
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([]);
  const [error, setError] = useState("");
  const [memuat, setMemuat] = useState(true);
  const [filters, setFilters] = useState<Filters>({});

  const muatSumberDaya = useCallback(async () => {
    const hasil = await ambilSumberDaya();
    setSumberDaya(hasil);
  }, []);

  const muatPeminjaman = useCallback(async (filter: Filters) => {
    const hasil = await ambilPeminjaman(filter);
    setPeminjaman(hasil);
  }, []);

  useEffect(() => {
    async function muatAwal() {
      setMemuat(true);
      setError("");

      try {
        await Promise.all([muatSumberDaya(), muatPeminjaman({})]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gagal memuat data.");
      } finally {
        setMemuat(false);
      }
    }

    void muatAwal();
  }, [muatSumberDaya, muatPeminjaman]);

  useEffect(() => {
    async function muatHasilFilter() {
      try {
        await muatPeminjaman(filters);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gagal memuat peminjaman.");
      }
    }

    void muatHasilFilter();
  }, [filters, muatPeminjaman]);

  async function tambahSumberDaya(input: InputSumberDaya) {
    setError("");
    await buatSumberDaya(input);
    await muatSumberDaya();
  }

  async function tambahPeminjaman(input: InputPeminjaman) {
    setError("");
    await buatPeminjaman(input);
    await Promise.all([
      muatSumberDaya(),
      muatPeminjaman(filters),
    ]);
  }

  function ubahFilter(nextFilters: Filters) {
    setFilters(nextFilters);
  }

  async function bukaDetail(id: number) {
    return await detailPeminjaman(id);
  }

  return (
    <main className="container">
      <header className="page-header">
        <p className="eyebrow">LAYANAN KAMPUS</p>
        <h1>PinjamKampus</h1>
        <p>Kelola sumber daya dan pengajuan peminjaman kampus.</p>
      </header>

      {error && (
        <div className="error global-error" role="alert">
          {error}
        </div>
      )}

      {memuat && <p className="loading">Memuat data...</p>}

      <SumberDayaComponent
        data={sumberDaya}
        onTambah={tambahSumberDaya}
      />

      <FormPeminjaman
        sumberDaya={sumberDaya}
        onTambah={tambahPeminjaman}
      />

      <DaftarPeminjaman
        data={peminjaman}
        sumberDaya={sumberDaya}
        onFilter={ubahFilter}
        onDetail={bukaDetail}
      />

      <footer className="page-footer">
        PinjamKampus · Sistem Peminjaman Kampus
      </footer>
    </main>
  );
}
