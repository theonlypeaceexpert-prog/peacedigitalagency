import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { servicePages, type ServicePageData } from "@/lib/service-pages";

export function ServiceDetail({ page }: { page: ServicePageData }) {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground">Services / {page.label}</Link>
        <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-tight sm:text-6xl">{page.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{page.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link to="/contact">{page.cta}<ArrowUpRight /></Link></Button>
          <Button asChild variant="outline" size="lg"><Link to="/portfolio">Explore the portfolio<ArrowUpRight /></Link></Button>
        </div>
      </section>
      <section className="border-y border-border bg-secondary/20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-14 md:grid-cols-2 md:gap-12">
          <h2 className="font-display text-3xl font-semibold">{page.problem}</h2>
          <p className="leading-relaxed text-muted-foreground">{page.explanation}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-display text-3xl font-bold">What we can help with</h2>
        <div className="mt-8 grid gap-x-12 sm:grid-cols-2">
          {page.deliverables.map(([title, text]) => <div key={title} className="border-t border-border py-7">
            <h3 className="flex items-center gap-3 font-display text-xl font-semibold"><Check className="h-5 w-5 shrink-0 text-muted-foreground" />{title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>
          </div>)}
        </div>
        <div className="mt-8 grid gap-5 border-t border-border pt-10 md:grid-cols-2">
          <h2 className="font-display text-2xl font-semibold">A useful starting brief</h2>
          <p className="leading-relaxed text-muted-foreground">{page.inputs} Deliverables, timing and price are agreed before work starts.</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="mb-7 font-display text-3xl font-bold">Before we start</h2>
        {page.faqs.map(([q, a]) => <details key={q} className="border-t border-border py-5">
          <summary className="cursor-pointer font-semibold">{q}</summary>
          <p className="mt-3 leading-relaxed text-muted-foreground">{a}</p>
        </details>)}
        <Button asChild size="lg" className="mt-8"><Link to="/contact">{page.cta}<ArrowUpRight /></Link></Button>
      </section>
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="font-display text-xl font-semibold">Related services</h2>
          <nav aria-label="Related services" className="mt-4 flex flex-wrap gap-3">
            {servicePages.filter(item => item.path !== page.path).map(item => <Button key={item.path} asChild variant="outline"><Link to={item.path}>{item.title}<ArrowUpRight /></Link></Button>)}
            <Button asChild variant="outline"><Link to="/ugc">UGC video ads<ArrowUpRight /></Link></Button>
          </nav>
        </div>
      </section>
    </Layout>
  );
}