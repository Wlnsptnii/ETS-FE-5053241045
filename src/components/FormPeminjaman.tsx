
import { useState, type FormEvent } from "react";
import type { InputPeminjaman, SumberDaya } from "../api/pinjam";

interface Props {
  sumberDaya: SumberDaya[];
  onTambah: (input: InputPeminjaman) => Promise<void>;
}

export default function FormPeminjaman({
  sumberDaya,
  onTambah,
}: Props) {
  const [sumberId, setSumberId] = useState("");
  const [peminjam, setPeminjam] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [slotMulai, setSlotMulai] = useState("1");
  const [slotSelesai, setSlotSelesai] = useState("1");
  const [jumlah, setJumlah] = useState("1");
  const [error, setError] = useState("");
  const [menyimpan, setMenyimpan] = useState(false);

  const sumberTerpilih = sumberDaya.find(
    (item) => item.id === Number(sumberId)
  );

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const namaPeminjam = peminjam.trim();
    const mulai = Number(slotMulai);
    const selesai = Number(slotSelesai);
    const jumlahAngka = Number(jumlah);

    if (!sumberTerpilih) {
      setError("Pilih sumber daya terlebih dahulu.");
      return;
    }

    if (!namaPeminjam || namaPeminjam.length > 50) {
      setError("Nama peminjam wajib diisi dan maksimal 50 karakter.");
      return;
    }

    if (!tanggal) {
      setError("Tanggal wajib diisi.");
      return;
    }

    if (
      !Number.isInteger(mulai) ||
      !Number.isInteger(selesai) ||
      mulai < 1 ||
      mulai > 8 ||
      selesai < 1 ||
      selesai > 8 ||
      selesai < mulai
    ) {
      setError("Slot harus antara 1 sampai 8 dan slot selesai tidak boleh sebelum slot mulai.");
      return;
    }

    if (
      !Number.isInteger(jumlahAngka) ||
      jumlahAngka < 1 ||
      jumlahAngka > sumberTerpilih.stok
    ) {
      setError(`Jumlah harus antara 1 sampai ${sumberTerpilih.stok}.`);
      return;
    }

    setMenyimpan(true);

    try {
      await onTambah({
        sumber_daya_id: Number(sumberId),
        peminjam: namaPeminjam,
        tanggal,
        slot_mulai: mulai,
        slot_selesai: selesai,
        jumlah: jumlahAngka,
      });

      setSumberId("");
      setPeminjam("");
      setTanggal("");
      setSlotMulai("1");
      setSlotSelesai("1");
      setJumlah("1");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Gagal menyimpan peminjaman."
      );
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <section className="panel">
      <h2>Form Peminjaman</h2>

      <form onSubmit={submit} className="form-grid">
        <label>
          Sumber daya
          <select
            value={sumberId}
            onChange={(e) => setSumberId(e.target.value)}
            required
          >
            <option value="">Pilih sumber daya</option>
            {sumberDaya.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama} — {item.jenis} (stok {item.stok})
              </option>
            ))}
          </select>
        </label>

        <label>
          Peminjam
          <input
            value={peminjam}
            onChange={(e) => setPeminjam(e.target.value)}
            maxLength={50}
            required
          />
        </label>

        <label>
          Tanggal
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
          />
        </label>

        <label>
          Slot mulai
          <select
            value={slotMulai}
            onChange={(e) => setSlotMulai(e.target.value)}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>

        <label>
          Slot selesai
          <select
            value={slotSelesai}
            onChange={(e) => setSlotSelesai(e.target.value)}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>

        <label>
          Jumlah
          <input
            type="number"
            min="1"
            max={sumberTerpilih?.stok ?? 1}
            step="1"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          disabled={menyimpan || sumberDaya.length === 0}
        >
          {menyimpan ? "Menyimpan..." : "Simpan peminjaman"}
        </button>
      </form>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
