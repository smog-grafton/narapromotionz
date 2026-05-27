export default function Loading() {
  return (
    <main className="section-shell">
      <div className="h-8 w-36 bg-white/10" />
      <div className="mt-5 h-24 max-w-3xl bg-white/10" />
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-48 border border-white/10 bg-white/[0.04]" />
        ))}
      </div>
    </main>
  );
}
