export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-400 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          In Development
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
          HU{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Preferred Partner
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-slate-400">
          Habib University&apos;s platform for exclusive brand partnerships,
          curated offers, and meaningful connections between students and
          industry leaders.
        </p>
      </div>
    </main>
  );
}
