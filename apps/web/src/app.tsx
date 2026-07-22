import { BookOpen, Compass, ShieldCheck } from "lucide-react";
import { Button, StatusBadge } from "@presstronic-academy/ui";

const shellItems = [
  { label: "Landing", state: "public" },
  { label: "Auth", state: "public" },
  { label: "Mission dashboard", state: "authenticated" },
  { label: "Lesson challenge", state: "authenticated" },
];

export function App() {
  return (
    <main className="min-h-screen bg-graphite-950 text-graphite-100">
      <section className="mx-auto grid min-h-screen w-full max-w-[1200px] gap-8 px-6 py-8 lg:grid-cols-[264px_1fr]">
        <aside className="border border-graphite-700 bg-graphite-900 p-5">
          <div className="flex items-center gap-3 text-cyan-100">
            <Compass aria-hidden="true" className="h-5 w-5" />
            <span className="font-mono text-xs uppercase tracking-[0.16em]">
              // Learner shell
            </span>
          </div>
          <nav aria-label="Learner scaffold routes" className="mt-8 grid gap-2">
            {shellItems.map((item) => (
              <div
                className="flex items-center justify-between border border-graphite-700 px-3 py-2 text-sm"
                key={item.label}
              >
                <span>{item.label}</span>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-graphite-300">
                  {item.state}
                </span>
              </div>
            ))}
          </nav>
        </aside>

        <section className="grid content-center gap-8">
          <div className="max-w-3xl">
            <StatusBadge>Scaffold online</StatusBadge>
            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">
              Presstronic Academy
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-graphite-300">
              Learner app foundation for public entry, auth handoff, and
              authenticated mission surfaces.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button>Start mission</Button>
              <Button variant="secondary">View route map</Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="border border-graphite-700 bg-graphite-900 p-5">
              <BookOpen aria-hidden="true" className="h-5 w-5 text-cyan-300" />
              <h2 className="mt-4 text-xl font-semibold">Public surfaces</h2>
              <p className="mt-2 text-sm leading-6 text-graphite-300">
                Landing and auth entry remain outside authenticated app chrome.
              </p>
            </div>
            <div className="border border-graphite-700 bg-graphite-900 p-5">
              <ShieldCheck
                aria-hidden="true"
                className="h-5 w-5 text-volt-300"
              />
              <h2 className="mt-4 text-xl font-semibold">App shell surfaces</h2>
              <p className="mt-2 text-sm leading-6 text-graphite-300">
                Dashboard, lessons, challenges, and mission log routes stay
                learner-owned.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
