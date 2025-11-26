import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 tracking-tight">
            <span className="text-white">Visualize </span>
            <span className="text-slate-400">Algorithms</span>
          </h1>

          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Learn through interactive visualizations and AI-powered explanations.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          <Link
            href="/visualizer"
            className="group bg-white/[0.03] backdrop-blur-sm rounded-2xl p-7 border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300"
          >
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>

            <h2 className="text-lg font-medium text-white mb-2">
              Algorithms
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              Interactive visualizations of sorting, searching, and graph algorithms.
            </p>

            <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
              Open →
            </span>
          </Link>

          <Link
            href="/chat"
            className="group bg-white/[0.03] backdrop-blur-sm rounded-2xl p-7 border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300"
          >
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>

            <h2 className="text-lg font-medium text-white mb-2">
              Algorithm Tutor
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              Ask questions about algorithms, complexity, and implementations.
            </p>

            <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
              Open →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
