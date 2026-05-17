"use client";
import { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { LuFileText } from "react-icons/lu";
import { RxReset } from "react-icons/rx";
import { getRandomNews } from "@/src/lib/news";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{
    extractive?: string;
    abstractive?: string;
  }>({});
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"extractive" | "abstractive" | "">("");  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    // Validasi jumlah kata sesuai kebutuhan skripsimu
    if (wordCount < 400 || wordCount > 1000) {
      setError("Teks harus 400–1000 kata!");
      setLoading(false);
      return;
    }

    try {
      // Mengambil URL dari .env.local atau fallback ke localhost
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      const res = await fetch(`${apiUrl}/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        setError(
          "Server ringkasan tidak merespons. Pastikan Ngrok/Backend sudah aktif.",
        );
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult({
          extractive: data.extractive,
          abstractive: data.abstractive,
        });
      }
    } catch {
      setError(
        "Koneksi gagal. Cek apakah URL Ngrok di .env.local sudah benar dan aktif.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText("");
    setResult({});
    setError("");
  };

  const handleExample = async () => {
  const randomNews = await getRandomNews();

  setText(randomNews);
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
          <div className="mb-2 flex items-center gap-2 text-black-700">
            <LuFileText className="h-4 w-4" />
            <h2 className="font-semibold">Extractive</h2>
          </div>
          <p className="text-sm text-slate-600">
            Memilih dan mengambil kalimat-kalimat penting langsung dari teks
            asli menggunakan model IndoBERT.
          </p>
        </article>

        <article className="rounded-xl border border-emerald-900/15 bg-white/90 p-5 shadow-sm backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-black-700">
            <HiOutlineSparkles className="h-4 w-4" />
            <h2 className="font-semibold">Abstractive</h2>
          </div>
          <p className="text-sm text-slate-600">
            Menghasilkan teks ringkasan baru yang merangkum ide utama dengan
            kata-kata yang berbeda dari teks asli menggunakan model IndoT5.
          </p>
        </article>
      </section>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 mt-5">
        <h3 className="text-2xl font-bold text-slate-800">Input Teks Berita</h3>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span>{wordCount} kata</span>
          <span>{sentenceCount} kalimat</span>
          <button
            type="button"
            onClick={handleExample}
            disabled={loading}
            className="font-medium text-emerald-700 hover:text-emerald-800 hover:cursor-pointer disabled:text-slate-400 disabled:cursor-not-allowed"
          >
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

      {error && (
        <p className="mt-1 text-sm font-medium text-red-500">{error}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSummarize}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 hover:cursor-pointer disabled:bg-emerald-500 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <HiOutlineSparkles className="h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <LuFileText className="h-4 w-4" />
              Ringkas Teks
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
        >
          <RxReset className="h-4 w-4" />
          Reset
        </button>
      </div>

      <section className="mt-8 grid gap-4 pb-3 md:grid-cols-2">
        <article className="rounded-2xl border border-emerald-900/10 bg-white/95 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between text-slate-700">
            <h4 className="font-semibold">Hasil Extractive</h4>
            <button
              type="button"
              onClick={() => handleCopy("extractive")}
              disabled={!result.extractive || loading}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <span>
                {result.extractive ? result.extractive.split(/\s+/).length : 0}{" "}
                kata
              </span>
              <FiCopy className="h-4 w-4" />
              <span>{copied === "extractive" ? "Tersalin" : "Copy"}</span>
            </button>
          </div>
          <div className="min-h-40 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-slate-700">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <HiOutlineSparkles className="h-6 w-6 animate-spin" />
                  <span className="text-sm">Memproses...</span>
                </div>
              </div>
            ) : (
              result.extractive || "Belum ada hasil extractive."
            )}
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
              disabled={!result.abstractive || loading}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <span>
                {result.abstractive
                  ? result.abstractive.split(/\s+/).length
                  : 0}{" "}
                kata
              </span>
              <FiCopy className="h-4 w-4" />
              <span>{copied === "abstractive" ? "Tersalin" : "Copy"}</span>
            </button>
          </div>
          <div className="min-h-40 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-slate-700">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <HiOutlineSparkles className="h-6 w-6 animate-spin" />
                  <span className="text-sm">Memproses...</span>
                </div>
              </div>
            ) : (
              result.abstractive || "Belum ada hasil abstractive."
            )}
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Teks baru yang dihasilkan dari analisis topik dan kata kunci utama.
          </p>
        </article>
      </section>
    </main>
  );
}
