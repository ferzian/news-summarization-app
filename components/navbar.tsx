import { FaFileAlt } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="border-b border-emerald-900/10 bg-white/90 px-4 py-4 shadow-sm backdrop-blur md:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-emerald-600 to-emerald-800 text-white shadow-md shadow-emerald-900/20">
            <FaFileAlt size={18} className="shrink-0" />
          </div>

          <div className="flex flex-col justify-center text-left leading-tight">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
              Peringkasan Teks Otomatis
            </h1>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-800/80 md:text-sm md:normal-case md:tracking-normal">
              Extractive &amp; Abstractive Summarization
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
