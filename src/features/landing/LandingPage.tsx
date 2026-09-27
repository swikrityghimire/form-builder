import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Wrench,
  Layers,
  GitBranch,
  BarChart3,
  FileJson,
  Check,
  Upload,
  Palette,
  Shield,
  Zap,
  MousePointerClick,
  Code2,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function LandingPage() {
  return (
    <div className="min-h-screen-safe bg-background flex flex-col relative">

      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            top: "-240px",
            width: "1000px",
            height: "700px",
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.25) 0%, hsl(var(--primary) / 0.05) 50%, transparent 100%)",
            filter: "blur(120px)",
            WebkitFilter: "blur(120px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "30%",
            left: "-240px",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
            filter: "blur(120px)",
            WebkitFilter: "blur(120px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "50%",
            right: "-240px",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
            filter: "blur(120px)",
            WebkitFilter: "blur(120px)",
          }}
        />
      </div>

      <header className="sticky top-0 z-40 w-full">
        <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 font-bold shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base tracking-tight">{APP_NAME}</span>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <Link to="/builder">
              <Button size="sm">
                <span className="hidden sm:inline">Open Builder</span>
                <span className="sm:hidden">Build</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative">

        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 pt-12 pb-12 md:pt-16 md:pb-16 text-center">

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.04em] leading-[1.02] text-foreground">
            Forms that feel
            <br />
            <span className="text-primary">effortless.</span>
          </h1>

          <p className="mt-8 text-base sm:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Design, preview, and share beautiful forms in seconds.
            <br className="hidden sm:block" />
            No backend. No database. No signup.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/builder" className="block">
              <Button
                size="lg"
                className="w-full sm:w-auto shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                Start Building Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/import" className="block">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Upload className="h-4 w-4 mr-2" />
                Import JSON
              </Button>
            </Link>
          </div>

          {/* Trust */}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 justify-center text-sm text-foreground/70 font-medium">
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
              <span>No signup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
              <span>Works offline</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
          <div className="relative">
            <div
              className="absolute inset-x-8 -top-4 h-[400px] -z-10 rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at center, hsl(var(--primary) / 0.35) 0%, transparent 70%)",
                filter: "blur(100px)",
                WebkitFilter: "blur(100px)",
              }}
            />

            <div className="rounded-2xl bg-card shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/40">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="ml-4 flex items-center gap-1.5 flex-1 max-w-sm h-7 rounded-md bg-background border border-border text-xs text-foreground/70 font-medium px-3">
                  <Shield className="h-3 w-3 text-green-600 shrink-0" />
                  <span className="truncate">formcraft.app/builder</span>
                </div>
              </div>

              <div className="p-6 sm:p-10 bg-background">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_220px] gap-5">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-3">
                      Fields
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { label: "Text", active: true },
                        { label: "Email", active: false },
                        { label: "Select", active: false },
                        { label: "Date", active: false },
                        { label: "File", active: false },
                      ].map((f) => (
                        <div
                          key={f.label}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium ${
                            f.active
                              ? "bg-primary/15 text-primary border border-primary/30"
                              : "text-foreground/70"
                          }`}
                        >
                          <div
                            className={`h-2.5 w-2.5 rounded-sm ${
                              f.active ? "bg-primary" : "bg-foreground/40"
                            }`}
                          />
                          <span>{f.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-3">
                      Canvas
                    </div>
                    <div className="space-y-2.5">
                      <div className="h-14 rounded-lg bg-card border-2 border-primary ring-4 ring-primary/10 flex items-center px-4 shadow-sm">
                        <span className="text-sm font-bold text-primary">
                          Full Name
                        </span>
                        <MousePointerClick className="h-4 w-4 text-primary ml-auto" />
                      </div>
                      <div className="h-14 rounded-lg bg-card border border-border flex items-center px-4">
                        <span className="text-sm font-medium text-foreground/70">
                          Email Address
                        </span>
                      </div>
                      <div className="h-14 rounded-lg bg-card border border-border flex items-center px-4">
                        <span className="text-sm font-medium text-foreground/70">
                          Message
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-3">
                      Preview
                    </div>
                    <div className="space-y-2.5">
                      <div className="h-14 rounded-lg border border-border bg-background flex items-center px-4">
                        <span className="text-sm font-medium text-foreground/70">
                          Name
                        </span>
                      </div>
                      <div className="h-14 rounded-lg border border-border bg-background flex items-center px-4">
                        <span className="text-sm font-medium text-foreground/70">
                          Email
                        </span>
                      </div>
                      <div className="h-14 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md">
                        Submit
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-4 tracking-wider uppercase">
              <Zap className="h-3 w-3" />
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-foreground">
              Powerful by default.
              <br />
              <span className="text-foreground/50">Simple by design.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
            {[
              {
                icon: Wrench,
                title: "Visual Builder",
                desc: "Drag and drop fields onto a live canvas. Configure everything visually — no code required.",
              },
              {
                icon: GitBranch,
                title: "Conditional Logic",
                desc: "Show or hide fields based on previous answers. Build smart, adaptive forms.",
              },
              {
                icon: Layers,
                title: "20+ Field Types",
                desc: "Text, email, select, radio, checkbox, date, file, rating, slider, and more.",
              },
              {
                icon: FileJson,
                title: "JSON Export",
                desc: "Every form is a portable JSON object. Store it anywhere, version it in Git.",
              },
              {
                icon: BarChart3,
                title: "Analytics",
                desc: "Visualize responses with charts and completion rates. Export to CSV.",
              },
              {
                icon: Palette,
                title: "Theming",
                desc: "5 presets and 13 fonts. Match your form to your brand identity.",
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title}>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">
                    {f.title}
                  </h3>
                  <p className="text-[15px] text-foreground/70 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-4 tracking-wider uppercase">
              <Rocket className="h-3 w-3" />
              Workflow
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] text-foreground">
              Three steps. That's it.
            </h2>
            <p className="text-foreground/70 mt-5 text-base sm:text-lg max-w-lg mx-auto">
              From idea to a working form in under 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
            {[
              {
                num: "1",
                icon: Wrench,
                title: "Build",
                desc: "Add fields from the palette and arrange them on the canvas.",
              },
              {
                num: "2",
                icon: Code2,
                title: "Export",
                desc: "Click Create JSON to get your portable form definition.",
              },
              {
                num: "3",
                icon: Rocket,
                title: "Share",
                desc: "Publish your form and collect responses — all in browser.",
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-background border-2 border-border flex items-center justify-center shadow-sm relative z-10">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center border-2 border-background shadow-sm z-20">
                      {s.num}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {s.title}
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed max-w-[240px]">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative border-t border-border/60 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full -z-0"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)",
            filter: "blur(100px)",
            WebkitFilter: "blur(100px)",
          }}
        />

        <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-28 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 rounded-2xl animate-pulse" />
              <div className="relative h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-xl">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.04em] leading-[1.05] text-foreground">
            Ready to build your
            <br />
            <span className="text-primary">first form?</span>
          </h2>

          <p className="text-foreground/70 mt-8 max-w-md mx-auto text-base sm:text-lg">
            No account, no setup, no backend. Just open the builder and start.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/builder" className="block">
              <Button
                size="lg"
                className="w-full sm:w-auto shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                Open Builder
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/import" className="block">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Try Import JSON
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 justify-center text-sm text-foreground/70 font-medium">
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
              <span>Open source</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
              <span>No signup</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 mt-auto">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/70">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">{APP_NAME}</span>
              <span className="text-foreground/40">·</span>
              <span>Built with React & TypeScript</span>
            </div>

            <div className="flex items-center gap-6 font-medium">
              <a href="#" className="hover:text-foreground transition">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition">
                Privacy
              </a>
              <span className="text-foreground/40">
                © {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}