import { ClipboardList, Gauge, Shield } from "lucide-react";
import { Button, StatusBadge } from "@presstronic-academy/ui";

const adminAreas = [
  "Content management",
  "Content health",
  "Support queue",
  "Reporting",
];

export function App() {
  return (
    <main className="min-h-screen bg-graphite-950 text-graphite-100">
      <section className="mx-auto grid min-h-screen w-full max-w-[1200px] gap-8 px-6 py-8 lg:grid-cols-[264px_1fr]">
        <aside className="border border-graphite-700 bg-graphite-900 p-5">
          <div className="flex items-center gap-3 text-cyan-100">
            <Shield aria-hidden="true" className="h-5 w-5" />
            <span className="font-mono text-xs uppercase tracking-[0.16em]">
              // Admin shell
            </span>
          </div>
          <nav aria-label="Admin scaffold areas" className="mt-8 grid gap-2">
            {adminAreas.map((area) => (
              <div
                className="border border-graphite-700 px-3 py-2 text-sm"
                key={area}
              >
                {area}
              </div>
            ))}
          </nav>
        </aside>

        <section className="grid content-center gap-8">
          <div className="max-w-3xl">
            <StatusBadge tone="caution">Operator workspace</StatusBadge>
            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">
              Academy Admin
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-graphite-300">
              Admin and instructor app foundation for content operations,
              learner support, and reporting surfaces.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button>Open queue</Button>
              <Button variant="secondary">Review content</Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="border border-graphite-700 bg-graphite-900 p-5">
              <ClipboardList
                aria-hidden="true"
                className="h-5 w-5 text-cyan-300"
              />
              <h2 className="mt-4 text-xl font-semibold">
                Content-owned routes
              </h2>
              <p className="mt-2 text-sm leading-6 text-graphite-300">
                Authoring, preview, publish, and moderation stay in the admin
                app.
              </p>
            </div>
            <div className="border border-graphite-700 bg-graphite-900 p-5">
              <Gauge aria-hidden="true" className="h-5 w-5 text-volt-300" />
              <h2 className="mt-4 text-xl font-semibold">Health surfaces</h2>
              <p className="mt-2 text-sm leading-6 text-graphite-300">
                Analytics and support placeholders remain UI-only until
                contracts are accepted.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
