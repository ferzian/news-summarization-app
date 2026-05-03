"use client";
import { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { LuFileText } from "react-icons/lu";
import { RxReset } from "react-icons/rx";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{
    extractive?: string;
    abstractive?: string;
  }>({});
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

    // Validasi jumlah kata sesuai kebutuhan skripsimu
    if (wordCount < 400 || wordCount > 1000) {
      setError("Teks harus 400–1000 kata!");
      return;
    }

    try {
      // Mengambil URL dari .env.local atau fallback ke localhost
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      
      const res = await fetch(`${apiUrl}/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // HEADER PENTING: Untuk melewati halaman peringatan Ngrok gratisan
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        setError("Server ringkasan tidak merespons. Pastikan Ngrok/Backend sudah aktif.");
        return;
      }

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult({
          extractive: data.extractive,
          abstractive: data.abstractive
        });
      }
    } catch {
      setError(
        "Koneksi gagal. Cek apakah URL Ngrok di .env.local sudah benar dan aktif.",
      );
    }
  };

  const handleReset = () => {
    setText("");
    setResult({});
    setError("");
  };

  const handleExample = () => {
    setText(
      "Jakarta – Industri teknologi informasi Indonesia terus mengalami pertumbuhan eksponensial dalam lima tahun terakhir, dengan kontribusi ekonomi digital diproyeksikan mencapai lebih dari 200 miliar dolar Amerika pada akhir tahun 2024. Pertumbuhan yang mengesankan ini didorong oleh meningkatnya adopsi internet di kalangan masyarakat urban dan semi-urban, khususnya dalam segmen e-commerce, fintech, layanan streaming, dan platform digital lainnya yang semakin mendominasi kehidupan sehari-hari. Menurut laporan terbaru dari Badan Pusat Statistik dan Asosiasi Penyelenggara Jasa Internet Indonesia, penetrasi internet di Indonesia telah mencapai 77 persen dari total populasi, dengan lebih dari 204 juta pengguna aktif yang terus bertambah setiap kuartal. Perkembangan infrastruktur digital yang pesat ini menciptakan peluang kerja baru yang luar biasa bagi profesional muda dan berpengalaman, terutama dalam bidang pengembangan perangkat lunak, analisis data besar, keamanan siber, dan artificial intelligence. Sejumlah startup teknologi Indonesia telah berhasil mendapatkan pendanaan substansial dari investor venture capital global dan regional, dengan beberapa mencapai status unicorn dengan valuasi melebihi satu miliar dolar Amerika. Perusahaan-perusahaan inovatif ini tidak hanya fokus pada pasar domestik yang luas, tetapi juga telah memperluas jangkauan bisnis mereka ke pasar-pasar di Asia Tenggara, Asia Selatan, dan bahkan ke pasar global yang lebih luas. Strategis ekspansi internasional ini membantu mereka memanfaatkan peluang pertumbuhan jangka panjang dan memperkuat posisi sebagai pemain teknologi regional yang signifikan. Pemerintah Indonesia melalui berbagai kementerian, terutama Kementerian Komunikasi dan Informatika, serta Kementerian Koordinator Bidang Perekonomian, juga aktif mendukung ekosistem teknologi dengan memberikan insentif pajak yang menarik, mempermudah proses regulasi dan perizinan, dan mendorong investasi besar-besaran dalam infrastruktur digital dan konektivitas. Program digitalisasi ambisius di berbagai sektor strategis, mulai dari pendidikan, kesehatan, pertanian, hingga administrasi pemerintah, telah mempercepat transformasi digital di negeri ini dan meningkatkan efisiensi layanan publik. Tantangan signifikan yang masih dihadapi industri teknologi termasuk kesenjangan digital yang lebar antara daerah urban dan pedesaan, kurangnya tersedianya tenaga kerja ahli terampil dan bersertifikat, serta keamanan siber yang perlu terus ditingkatkan untuk melindungi data pengguna dan aset digital perusahaan dari ancaman kejahatan online. Meski demikian, para pemimpin industri dan pengambil kebijakan tetap sangat optimis bahwa Indonesia memiliki potensi besar dan fundamental untuk berkembang menjadi pusat teknologi digital terkemuka di wilayah Asia Tenggara dalam dekade mendatang, mengingat besarnya pasar domestik, bonus demografi, dan semangat kewirausahaan yang tinggi. Kolaborasi strategis dan berkelanjutan antara pemerintah, institusi akademis dan penelitian, serta sektor privat dianggap kunci utama untuk mewujudkan visi ambisius tersebut dan memanfaatkan peluang pertumbuhan ekonomi digital secara optimal dan berkelanjutan.",
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

      {/* <section className="mt-8 rounded-2xl border border-emerald-900/10 bg-white/90 p-5 shadow-sm backdrop-blur md:p-6"> */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 mt-5">
          <h3 className="text-2xl font-bold text-slate-800">
            Input Teks Berita
          </h3>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>{wordCount} kata</span>
            <span>{sentenceCount} kalimat</span>
            <button
              type="button"
              onClick={handleExample}
              className="font-medium text-emerald-700 hover:text-emerald-800 hover:cursor-pointer"
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
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <LuFileText className="h-4 w-4" />
            Ringkas Teks
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:cursor-pointer"
          >
            <RxReset className="h-4 w-4" />
            Reset
          </button>
        </div>
      {/* </section> */}

      <section className="mt-8 grid gap-4 pb-3 md:grid-cols-2">
        <article className="rounded-2xl border border-emerald-900/10 bg-white/95 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between text-slate-700">
            <h4 className="font-semibold">Hasil Extractive</h4>
            <button
              type="button"
              onClick={() => handleCopy("extractive")}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:cursor-pointer"
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
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:cursor-pointer"
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