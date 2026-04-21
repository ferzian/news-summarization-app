"use client";
import { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { LuFileText } from "react-icons/lu";
import { RxReset } from "react-icons/rx";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ extractive?: string; abstractive?: string }>({});
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"extractive" | "abstractive" | "">("");

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentenceCount = text.trim()
    ? text
        .split(/[.!?]+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean).length
    : 0;

  const handleSummarize = async () => {
    setError("");
    setResult({});

    if (wordCount < 400 || wordCount > 1000) {
      setError("Teks harus 400–1000 kata!");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        setError("Server ringkasan tidak merespons dengan baik. Coba lagi.");
        return;
      }

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("Tidak dapat terhubung ke API. Pastikan backend berjalan di port 8000.");
    }
  };

  const handleReset = () => {
    setText("");
    setResult({});
    setError("");
  };

  const handleExample = () => {
    setText(
      "Pemerintah daerah mengumumkan program digitalisasi layanan publik untuk meningkatkan akses masyarakat terhadap administrasi kependudukan. Program ini mencakup pembuatan KTP, kartu keluarga, serta akta kelahiran secara daring melalui satu portal terpadu. Menurut dinas terkait, langkah ini dilakukan untuk memangkas antrean panjang di kantor pelayanan dan meningkatkan efisiensi proses verifikasi data. Masyarakat dapat mengakses layanan ini melalui aplikasi mobile atau situs web resmi pemerintah daerah, dengan fitur unggah dokumen yang aman dan sistem notifikasi untuk setiap tahap proses. Diharapkan dengan adanya digitalisasi ini, masyarakat dapat lebih mudah dan cepat mendapatkan dokumen kependudukan tanpa harus datang langsung ke kantor pelayanan."
    );
  };

  const handleCopy = async (type: "extractive" | "abstractive") => {
    const payload = result[type];
    if (!payload) return;

    await navigator.clipboard.writeText(payload);
    setCopied(type);
    setTimeout(() => setCopied(""), 1200);
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <section className="mb-6 rounded-2xl border border-emerald-900/10 bg-white/85 p-5 shadow-sm backdrop-blur md:p-6">
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
          Uji Ringkasan Berita Indonesia
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
          Tempelkan berita untuk membandingkan hasil extractive dan abstractive.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-emerald-900/15 bg-white/90 p-5 shadow-sm backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-emerald-700">
            <LuFileText className="h-4 w-4" />
            <h2 className="font-semibold">Extractive</h2>
          </div>
          <p className="text-sm text-slate-600">
            Memilih dan mengambil kalimat-kalimat penting langsung dari teks asli menggunakan model IndoBERT.
          </p>
        </article>

        <article className="rounded-xl border border-emerald-900/15 bg-white/90 p-5 shadow-sm backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-emerald-700">
            <HiOutlineSparkles className="h-4 w-4" />
            <h2 className="font-semibold">Abstractive</h2>
          </div>
          <p className="text-sm text-slate-600">
            Menghasilkan teks ringkasan baru yang merangkum ide utama dengan kata-kata yang berbeda dari teks asli menggunakan model IndoT5.
          </p>
        </article>
      </section>

      <section className="mt-8 rounded-2xl border border-emerald-900/10 bg-white/90 p-5 shadow-sm backdrop-blur md:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-800">Input Teks Berita</h3>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>{wordCount} kata</span>
            <span>{sentenceCount} kalimat</span>
            <button type="button" onClick={handleExample} className="font-medium text-emerald-700 hover:text-emerald-800">
              Coba contoh teks
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          placeholder="Tempelkan teks berita di sini..."
        />

        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSummarize}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <LuFileText className="h-4 w-4" />
            Ringkas Teks
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <RxReset className="h-4 w-4" />
            Reset
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-4 pb-3 md:grid-cols-2">
        <article className="rounded-2xl border border-emerald-900/10 bg-white/95 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between text-slate-700">
            <h4 className="font-semibold">Hasil Extractive</h4>
            <button
              type="button"
              onClick={() => handleCopy("extractive")}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              <span>{result.extractive ? result.extractive.split(/\s+/).length : 0} kata</span>
              <FiCopy className="h-4 w-4" />
              <span>{copied === "extractive" ? "Tersalin" : "Copy"}</span>
            </button>
          </div>
          <div className="min-h-40 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-slate-700">
            {result.extractive || "Belum ada hasil extractive."}
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Kalimat dipilih langsung dari teks asli berdasarkan skor tertinggi.
          </p>
        </article>

        <article className="rounded-2xl border border-emerald-900/10 bg-white/95 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between text-slate-700">
            <h4 className="font-semibold">Hasil Abstractive</h4>
            <button
              type="button"
              onClick={() => handleCopy("abstractive")}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              <span>{result.abstractive ? result.abstractive.split(/\s+/).length : 0} kata</span>
              <FiCopy className="h-4 w-4" />
              <span>{copied === "abstractive" ? "Tersalin" : "Copy"}</span>
            </button>
          </div>
          <div className="min-h-40 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-slate-700">
            {result.abstractive || "Belum ada hasil abstractive."}
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Teks baru yang dihasilkan dari analisis topik dan kata kunci utama.
          </p>
        </article>
      </section>
    </main>
  );
}