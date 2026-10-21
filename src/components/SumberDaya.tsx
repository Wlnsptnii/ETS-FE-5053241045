
import { useState, type FormEvent } from "react";
import type {
  InputSumberDaya,
  SumberDaya as SumberDayaType,
} from "../api/pinjam";

interface Props {
  data: SumberDayaType[];
  onTambah: (input: InputSumberDaya) => Promise<void>;
}

export default function SumberDaya({ data, onTambah }: Props) {
  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState<"ruang" | "alat">("ruang");
  const [stok, setStok] = useState("1");
  const [error, setError] = useState("");
  const [menyimpan, setMenyimpan] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const namaBersih = nama.trim();
    const stokAngka = Number(stok);

    if (!namaBersih || namaBersih.length > 50) {
      setError("Nama wajib diisi dan maksimal 50 karakter.");
      return;
    }

    if (!Number.isInteger(stokAngka) || stokAngka < 1) {
      setError("Stok harus berupa bilangan bulat minimal 1.");
      return;
    }

    setMenyimpan(true);

    try {
      await onTambah({
        nama: namaBersih,
        jenis,
        stok: stokAngka,
      });

      setNama("");
      setJenis("ruang");
      setStok("1");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Gagal menyimpan sumber daya."
      );
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <section className="panel">
      <h2>Kelola Sumber Daya</h2>

      <form onSubmit={submit} className="form-grid">
        <label>
          Nama sumber daya
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            maxLength={50}
            required
          />
        </label>

        <label>
          Jenis
          <select
            value={jenis}
            onChange={(e) =>
              setJenis(e.target.value as "ruang" | "alat")
            }
          >
            <option value="ruang">Ruang</option>
            <option value="alat">Alat</option>
          </select>
        </label>

        <label>
          Stok
          <input
            type="number"
            min="1"
            step="1"
            value={stok}
            onChange={(e) => setStok(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={menyimpan}>
          {menyimpan ? "Menyimpan..." : "Simpan sumber daya"}
        </button>
      </form>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <h3>Daftar Sumber Daya</h3>

      {data.length === 0 ? (
        <p>Belum ada sumber daya.</p>
      ) : (
        <ul aria-label="Daftar sumber daya" className="data-list">
          {data.map((item) => (
            <li key={item.id}>
              <strong>{item.nama}</strong>
              <span>
                {item.jenis} · Stok: {item.stok}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
