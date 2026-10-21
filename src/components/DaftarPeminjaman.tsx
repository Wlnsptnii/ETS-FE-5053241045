import { useState } from "react";
import type { Peminjaman, SumberDaya } from "../api/pinjam";

interface Props {
  data: Peminjaman[];
  sumberDaya: SumberDaya[];
  onFilter: (filters: {
    sumber_daya_id?: string;
    tanggal?: string;
    status?: string;
  }) => void;
  onDetail: (id: number) => Promise<Peminjaman>;
}

export default function DaftarPeminjaman({
  data,
  sumberDaya,
  onFilter,
  onDetail,
}: Props) {
  const [sumberId, setSumberId] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [status, setStatus] = useState("");
  const [detail, setDetail] = useState<Peminjaman | null>(null);
  const [error, setError] = useState("");
  const [memuatDetail, setMemuatDetail] = useState(false);

  function terapkanFilter() {
    onFilter({
      sumber_daya_id: sumberId,
      tanggal,
      status,
    });
  }

  async function lihatDetail(id: number) {
    setError("");
    setDetail(null);
    setMemuatDetail(true);

    try {
      const hasil = await onDetail(id);
      setDetail(hasil);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Gagal mengambil detail peminjaman."
      );
    } finally {
      setMemuatDetail(false);
    }
  }

  return (
    <section className="panel">
      <h2>Daftar Peminjaman</h2>

      <div className="form-grid">
        <label>
          Filter sumber daya
          <select
            value={sumberId}
            onChange={(e) => setSumberId(e.target.value)}
          >
            <option value="">Semua</option>
            {sumberDaya.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama}
              </option>
            ))}
          </select>
        </label>

        <label>
          Filter tanggal
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
        </label>

        <label>
          Filter status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Semua</option>
            <option value="aktif">Aktif</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>
        </label>

        <button type="button" onClick={terapkanFilter}>
          Terapkan filter
        </button>
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {memuatDetail && <p>Memuat detail...</p>}

      {data.length === 0 ? (
        <p>Belum ada peminjaman.</p>
      ) : (
        <ul
          aria-label="Daftar peminjaman"
          className="data-list"
        >
          {data.map((item) => (
            <li key={item.id}>
              <strong>{item.peminjam}</strong>

              <span>
                {item.tanggal} · Slot {item.slot_mulai}-
                {item.slot_selesai}
                {" · "}Jumlah: {item.jumlah}
                {" · "}Status: {item.status}
              </span>

              <button
                type="button"
                onClick={() => lihatDetail(item.id)}
              >
                Detail
              </button>
            </li>
          ))}
        </ul>
      )}

      {detail && (
        <div
          aria-label="Detail peminjaman"
          className="detail-panel"
        >
          <h3>Detail Peminjaman</h3>
          <p>ID: {detail.id}</p>
          <p>Sumber daya ID: {detail.sumber_daya_id}</p>
          <p>Peminjam: {detail.peminjam}</p>
          <p>Tanggal: {detail.tanggal}</p>
          <p>
            Slot: {detail.slot_mulai}-{detail.slot_selesai}
          </p>
          <p>Jumlah: {detail.jumlah}</p>
          <p>Status: {detail.status}</p>

          <button
            type="button"
            onClick={() => setDetail(null)}
          >
            Tutup detail
          </button>
        </div>
      )}
    </section>
  );
}