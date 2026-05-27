export default function VideosLoading() {
  return (
    <main className="section-shell">
      <div className="h-8 w-32 bg-white/10" />
      <div className="mt-4 h-24 max-w-3xl bg-white/10" />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-80 border border-white/10 bg-white/[0.04]" />
        ))}
      </div>
    </main>
  );
}
