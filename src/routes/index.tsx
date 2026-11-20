import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { PERIODS, calcPeriod } from "@/lib/time-calc";

type IndexSearch = {
  angulo?: string;
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): IndexSearch => ({
    angulo: typeof search.angulo === "string" ? search.angulo : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Escadinha da Fé — Troque a tela por 10 minutos de Bíblia" },
      {
        name: "description",
        content:
          "1000 atividades bíblicas para imprimir, separadas por idade (2 a 10 anos). Pagamento único a partir de R$ 12.",
      },
      { property: "og:title", content: "Escadinha da Fé — 1000 Atividades Bíblicas" },
      {
        property: "og:description",
        content: "Troque a tela por 10 minutos de Bíblia. Atividades para imprimir de 2 a 10 anos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* Links de checkout — configure aqui (Kiwify). */
const CHECKOUT_COMPLETO = "https://pay.kiwify.com.br/0tR6AQs"; // R$ 24,90
const CHECKOUT_BASICO = "https://pay.kiwify.com.br/mQlmf31"; // R$ 12

function goPricing(e?: React.MouseEvent) {
  if (e && typeof e.preventDefault === "function") {
    e.preventDefault();
  }
  const el = document.getElementById("pacotes");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
function checkout(url: string) {
  if (!url) {
    goPricing();
    return;
  }
  if (typeof window === "undefined") return;

  // Detecta se a página está sendo visualizada dentro de um iframe (ex: preview do Lovable)
  const inIframe = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();

  if (inIframe) {
    // Tenta navegar pela janela pai para abrir fora do iframe e não ser bloqueado pelo Kiwify
    try {
      if (window.top) {
        window.top.location.href = url;
        return;
      }
    } catch {
      // Se a sandbox do iframe bloquear window.top, abre diretamente em nova aba/janela externa
    }
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  // No site publicado / fora de iframe, navegação direta na mesma janela
  window.location.href = url;
}

/** Espaço reservado para imagem original ainda não fornecida. */
function Img({ name, ratio, className = "" }: { name: string; ratio: string; className?: string }) {
  return (
    <div
      className={`flex w-full items-center justify-center bg-muted p-3 text-center text-xs font-bold text-muted-foreground ${className}`}
      style={{ aspectRatio: ratio }}
    >
      📷 Imagem a fornecer:
      <br />
      {name}
    </div>
  );
}

function CTA({
  children,
  onClick = goPricing,
  className = "",
  href,
}: {
  children: ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  href?: string;
}) {
  if (href) {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          // Usa o href atual do link, que a Utmify enriquece com os UTMs do anúncio
          checkout(e.currentTarget.href || href);
        }}
        className={`btn-go ${className}`}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`btn-go ${className}`}>
      {children}
    </button>
  );
}

function Index() {
  return (
    <main className="pb-28">
      {/* 2. Barra superior */}
      <div className="bg-sun px-4 py-3 text-center text-[15px] font-extrabold text-navy">
        💌 Receba no e-mail na hora · Atividades de 2 a 10 anos
      </div>

      <Hero />
      <Material />
      <Calculadora />
      <AntesDepois />
      <Escada />
      <Simples />
      <Perfeito />
      <Bonus />
      <Pacotes />
      <Garantia />
      <FAQ />
      <Final />
      <StickyBar />
    </main>
  );
}

const W = "mx-auto w-full max-w-[480px] px-4";

function TitleRays({ className, mirrored = false }: { className?: string; mirrored?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 28 28"
      fill="none"
      className={className}
      style={{
        color: "var(--sun, #FFD84D)",
        ...(mirrored ? { transform: "scaleX(-1)" } : {}),
      }}
    >
      <line x1="19" y1="14" x2="7" y2="3" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      <line x1="18" y1="18" x2="3" y2="15" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      <line x1="19" y1="22" x2="6" y2="26" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

function useAngulo() {
  let searchAngulo: string | undefined;
  try {
    const search = Route.useSearch();
    searchAngulo = (search as IndexSearch)?.angulo;
  } catch {
    // fallback se fora do contexto do router
  }

  const [angulo, setAngulo] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("angulo");
      if (p) return p.toLowerCase();
    }
    return (searchAngulo || "").toLowerCase();
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("angulo");
      if (p) setAngulo(p.toLowerCase());
    }
  }, [searchAngulo]);

  return angulo === "celular" ? "celular" : "jesus";
}

function Hero() {
  const isJesus = useAngulo() === "jesus";

  return (
    <section className="relative overflow-hidden bg-navy-grad pb-12 pt-4 sm:pt-6 text-primary-foreground">
      <span className="absolute left-4 top-[500px] h-3 w-3 rounded-full bg-go" />
      <div className={`${W} text-center`}>
        <span className="inline-block rounded-full bg-sun px-3.5 sm:px-5 py-1.5 sm:py-2 font-display text-[11.5px] sm:text-sm font-extrabold uppercase tracking-wider text-navy shadow-sm">
          👧 Para crianças de 2 a 10 anos
        </span>
        <h1
          className={`relative mt-2.5 sm:mt-4 font-display font-bold uppercase leading-[1.12] ${
            isJesus
              ? "text-[1.34rem] min-[360px]:text-[1.55rem] min-[390px]:text-[1.66rem] min-[420px]:text-[1.755rem] sm:text-[2.5rem]"
              : "text-[1.3875rem] min-[360px]:text-[1.6rem] min-[390px]:text-[1.71rem] min-[420px]:text-[1.8125rem] sm:text-[2.5rem]"
          }`}
        >
          {isJesus ? (
            <>
              <span className="relative inline-block whitespace-nowrap">
                <TitleRays className="absolute -top-2 -left-3 sm:-top-3.5 sm:-left-7 w-[18px] h-[18px] sm:w-7 sm:h-7 text-sun pointer-events-none select-none" />
                DESPERTE O{" "}
                <span className="relative inline-block rounded-[10px] sm:rounded-[14px] bg-sun px-[0.22em] sm:px-[0.32em] pt-[0.1em] pb-[0.2em] text-navy">
                  INTERESSE
                </span>
              </span>
              <span className="block mt-0.5 sm:mt-1 whitespace-nowrap [word-spacing:-0.05em] sm:[word-spacing:normal]">
                DAS CRIANÇAS POR{" "}
                <span className="relative -top-[3px] sm:-top-[5px] inline-block rounded-[10px] sm:rounded-[14px] bg-sun px-[0.16em] sm:px-[0.32em] pt-[0.18em] pb-[0.12em] text-navy">
                  JESUS!
                </span>
              </span>
            </>
          ) : (
            <>
              <span className="relative inline-block whitespace-nowrap">
                <TitleRays className="absolute -top-2 -left-3 sm:-top-3.5 sm:-left-7 w-[18px] h-[18px] sm:w-7 sm:h-7 text-sun pointer-events-none select-none" />
                TROQUE O{" "}
                <span className="relative inline-block rounded-[10px] sm:rounded-[14px] bg-sun px-[0.24em] sm:px-[0.35em] pt-[0.1em] pb-[0.2em] text-navy">
                  CELULAR
                </span>
              </span>
              <span className="block mt-0.5 sm:mt-1 whitespace-nowrap [word-spacing:-0.05em] sm:[word-spacing:normal]">
                POR MOMENTOS COM{" "}
                <span className="relative -top-[3px] sm:-top-[5px] inline-block rounded-[10px] sm:rounded-[14px] bg-sun px-[0.16em] sm:px-[0.32em] pt-[0.18em] pb-[0.12em] text-navy">
                  DEUS!
                </span>
              </span>
            </>
          )}
        </h1>
        {isJesus ? (
          <p className="mt-3.5 sm:mt-4 text-[15.5px] min-[390px]:text-[16.5px] sm:text-[18.5px] font-medium leading-[1.4] text-white w-full max-w-[460px] mx-auto text-center">
            São 1.000 atividades bíblicas para imprimir, separadas por idade, com jogos e desafios que prendem a atenção das crianças enquanto aprendem sobre Jesus!
          </p>
        ) : (
          <p className="mt-5 sm:mt-6 text-[18px] sm:text-[20px] font-medium leading-[1.4] sm:leading-normal text-white w-[98%] max-w-[420px] sm:w-full sm:max-w-none mx-auto text-center">
            São 1.000 atividades bíblicas para imprimir,
            <br className="sm:hidden" />{" "}
            separadas por idade, para as crianças
            <br className="sm:hidden" />{" "}
            brincarem, colorirem e aprenderem sobre
            <br className="sm:hidden" />{" "}
            Jesus longe das telas!
          </p>
        )}

        <div className={`relative ${isJesus ? "mt-4 sm:mt-6" : "mt-5 sm:mt-8"} w-[84%] sm:w-full mx-auto`}>
          <div className="rotate-[1.5deg] sm:rotate-[2deg] overflow-hidden rounded-3xl border-[5px] sm:border-[6px] border-card bg-card shadow-lg">
            <img
              src="/mae-criancas.webp"
              alt="Mãe e duas crianças com atividades bíblicas"
              className="hero-main-card-img w-full h-auto block"
              width={640}
              height={799}
            />
          </div>
          <div className="absolute -left-2.5 -top-3 sm:-left-2.5 sm:-top-5 z-10 flex h-[74px] w-[74px] sm:h-24 sm:w-24 -rotate-12 items-center justify-center rounded-full border-[3.5px] sm:border-4 border-dashed border-card bg-sun font-display text-[11.5px] sm:text-sm font-bold uppercase leading-tight text-navy shadow-md">
            É só
            <br />
            imprimir!
          </div>
          <div className="absolute -bottom-3.5 sm:-bottom-6 -right-1.5 sm:-right-2 z-10 w-[44%] sm:w-[50%] rotate-[4deg] overflow-hidden rounded-2xl border-[3.5px] sm:border-4 border-card bg-card shadow-xl">
            <img
              src="/mockup-livros.webp"
              alt="Mockup dos livros Escadinha da Fé"
              className="w-full aspect-square object-cover block"
            />
          </div>
        </div>

        <div className="mx-auto mt-6 sm:mt-8 flex w-fit items-center gap-4 sm:gap-5 rounded-2xl sm:rounded-3xl bg-card px-5 sm:px-6 py-2.5 sm:py-3 text-left shadow-md">
          <span className="text-[12.5px] sm:text-sm font-semibold leading-tight text-muted-foreground">
            a partir de
            <br />
            pagamento único
          </span>
          <span className="font-display text-[32px] sm:text-4xl font-bold text-go">R$ 12</span>
        </div>

        <div className="mt-5">
          <CTA className="hero-cta-pulse">Quero as atividades</CTA>
        </div>
        <p className="mt-5 text-sm font-bold opacity-85">
          ⚡ Liberado na hora · ♾️ Acesso para sempre · 🛡️ 7 dias de garantia
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          {["🧠 Atenção", "✏️ Coordenação", "📖 Histórias da Bíblia", "👨‍👩‍👧 Momento em família"].map((c) => (
            <span key={c} className="rounded-full bg-card px-4 py-2 font-display text-[17px] font-bold text-navy">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const CAROUSEL_PAGES = [
  { src: "/carrossel/pagina-01.jpg", alt: "Atividade 1 — Arca de Noé para colorir" },
  { src: "/carrossel/pagina-02.jpg", alt: "Atividade 2 — Caça-palavras Arca de Noé" },
  { src: "/carrossel/pagina-03.png", alt: "Atividade 3 — Labirinto a ovelha perdida" },
  { src: "/carrossel/pagina-04.jpg", alt: "Atividade 4 — Perguntas Arca de Noé" },
  { src: "/carrossel/pagina-05.png", alt: "Atividade 5 — Labirinto O chamado de Abraão" },
  { src: "/carrossel/pagina-06.jpg", alt: "Atividade 6 — Desenho O nascimento de Isaque" },
  { src: "/carrossel/pagina-07.jpg", alt: "Atividade 7 — Desenho Rebeca no poço" },
  { src: "/carrossel/pagina-08.jpg", alt: "Atividade 8 — Desenho A escada de Jacó" },
  { src: "/carrossel/pagina-09.jpg", alt: "Atividade 9 — Desenho José perdoa os irmãos" },
  { src: "/carrossel/pagina-10.jpg", alt: "Atividade 10 — Desenho Os doze espias" },
  { src: "/carrossel/pagina-11.jpg", alt: "Atividade 11 — Desenho Deus chama Samuel" },
  { src: "/carrossel/pagina-12.jpg", alt: "Atividade 12 — Desenho Neemias reconstrói o muro" },
  { src: "/carrossel/pagina-13.png", alt: "Atividade 13 — Labirinto Jeremias e o oleiro" },
  { src: "/carrossel/pagina-14.png", alt: "Atividade 14 — Labirinto Jonas e o grande peixe" },
  { src: "/carrossel/pagina-15.png", alt: "Atividade 15 — Labirinto Jesus anda sobre as águas" },
  { src: "/carrossel/pagina-16.webp", alt: "Atividade 16 — Labirinto Os dez leprosos" },
  { src: "/carrossel/pagina-17.webp", alt: "Atividade 17 — Labirinto A moeda perdida" },
  { src: "/carrossel/pagina-18.webp", alt: "Atividade 18 — Desenho A entrada em Jerusalém" },
  { src: "/carrossel/pagina-19.webp", alt: "Atividade 19 — Labirinto Rebeca no poço" },
];

const TILTS = [
  "rotate-[0.9deg]",
  "-rotate-[0.8deg]",
  "rotate-[0.7deg]",
  "-rotate-[1deg]",
  "rotate-[0.8deg]",
  "-rotate-[0.7deg]",
];

function MaterialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: (viewSize, n) => (viewSize < 640 ? 16 : (viewSize - n) / 2),
    containScroll: false,
    loop: false,
    dragFree: false,
    skipSnaps: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative w-full mt-3 sm:mt-6 mb-4 sm:mb-6 select-none">
      {/* Botões de navegação no desktop */}
      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Imagem anterior"
        disabled={!canScrollPrev}
        className={`hidden md:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-card text-navy shadow-lg transition-all cursor-pointer ${
          canScrollPrev
            ? "hover:scale-105 active:scale-95 opacity-100"
            : "opacity-40 cursor-not-allowed"
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={scrollNext}
        aria-label="Próxima imagem"
        disabled={!canScrollNext}
        className={`hidden md:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-card text-navy shadow-lg transition-all cursor-pointer ${
          canScrollNext
            ? "hover:scale-105 active:scale-95 opacity-100"
            : "opacity-40 cursor-not-allowed"
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Viewport do carrossel */}
      <div
        ref={emblaRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing w-full"
        style={{ touchAction: "pan-y" }}
      >
        {/* Trilha horizontal */}
        <div
          className="flex gap-3 sm:gap-6 py-1.5 sm:py-6"
          style={{ touchAction: "pan-y" }}
        >
          {CAROUSEL_PAGES.map((page, i) => (
            <div
              key={page.src}
              className="w-[76vw] max-w-[360px] sm:w-[240px] sm:max-w-none md:w-[260px] lg:w-[280px] shrink-0"
            >
              <div
                className={`overflow-hidden rounded-2xl bg-card shadow-soft p-2 sm:p-2.5 transition-transform duration-200 hover:scale-[1.02] ${
                  TILTS[i % TILTS.length]
                }`}
              >
                <div
                  style={{ aspectRatio: "560 / 792" }}
                  className="w-full flex items-center justify-center overflow-hidden rounded-xl bg-card"
                >
                  <img
                    src={page.src}
                    alt={page.alt}
                    className="w-full h-full block object-contain pointer-events-none select-none"
                    draggable={false}
                    loading={i < 5 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const DEPOIMENTOS = [
  {
    src: "/depoimentos/depoimento-1.jpg",
    alt: "Depoimento de Juliana Martins no WhatsApp mostrando as atividades de O Chamado de Abraão",
    name: "Juliana Martins",
  },
  {
    src: "/depoimentos/depoimento-2.jpg",
    alt: "Depoimento de Camila Rodrigues no WhatsApp mostrando o desenho colorido de Jesus com as crianças",
    name: "Camila Rodrigues",
  },
  {
    src: "/depoimentos/depoimento-3.jpg",
    alt: "Depoimento de Dona Helena no WhatsApp sobre o momento especial com os netinhos com a história de Jonas",
    name: "Dona Helena",
  },
  {
    src: "/depoimentos/depoimento-4.jpg",
    alt: "Depoimento de Renata Souza no WhatsApp elogiando o pacote completo e os esboços de aula",
    name: "Renata Souza",
  },
  {
    src: "/depoimentos/depoimento-5.jpg",
    alt: "Depoimento de Patrícia Almeida no WhatsApp usando as atividades na Escola Bíblica Infantil",
    name: "Patrícia Almeida",
  },
];

function DepoimentosCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    containScroll: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalImage(null);
    };
    if (modalImage) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [modalImage]);

  return (
    <div className="relative w-full mt-4 sm:mt-6 select-none">
      {/* Seta esquerda no desktop */}
      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Depoimento anterior"
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-card/95 text-navy shadow-md transition hover:scale-105 active:scale-95 cursor-pointer border border-navy/10"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Seta direita no desktop */}
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Próximo depoimento"
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-card/95 text-navy shadow-md transition hover:scale-105 active:scale-95 cursor-pointer border border-navy/10"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Viewport do carrossel */}
      <div
        ref={emblaRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing w-full"
        style={{ touchAction: "pan-y" }}
      >
        <div className="flex gap-4 sm:gap-6 py-2" style={{ touchAction: "pan-y" }}>
          {DEPOIMENTOS.map((d, i) => (
            <div
              key={d.src}
              className="w-[82vw] max-w-[315px] sm:w-[320px] shrink-0 mx-auto"
            >
              <div
                onClick={() => setModalImage(d.src)}
                className="group relative overflow-hidden rounded-2xl bg-card border-[4px] border-white cursor-pointer"
                title="Toque para ampliar"
              >
                <img
                  src={d.src}
                  alt={d.alt}
                  className="w-full h-auto block object-contain pointer-events-none select-none rounded-[12px]"
                  width={576}
                  height={1024}
                  loading={i === 0 ? "eager" : "lazy"}
                  draggable={false}
                />
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-navy/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm opacity-90 group-hover:opacity-100 transition shadow-sm">
                  <span>🔍 Ampliar</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores (dots) de navegação */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {DEPOIMENTOS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              selectedIndex === i ? "w-6 bg-navy" : "w-2 bg-navy/30 hover:bg-navy/50"
            }`}
            aria-label={`Ir para depoimento ${i + 1}`}
          />
        ))}
      </div>

      {/* Modal / Lightbox de ampliação ao tocar ou clicar */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setModalImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-[420px] w-full max-h-[92vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalImage(null)}
              className="self-end mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition text-lg font-bold cursor-pointer"
              aria-label="Fechar"
            >
              ✕
            </button>
            <div className="overflow-hidden rounded-2xl bg-card shadow-2xl border border-white/20">
              <img
                src={modalImage}
                alt="Depoimento ampliado"
                className="w-full h-auto max-h-[80vh] object-contain block select-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Material() {
  return (
    <section id="material" className="bg-sun pt-8 pb-10 sm:py-12 overflow-hidden">
      <div className={`${W} text-center`}>
        <h2 className="text-[1.85rem] sm:text-[2.2rem] font-bold leading-tight text-navy">📸 Veja o material por dentro</h2>
        <div className="mt-3.5 sm:mt-6 flex justify-center gap-2.5 sm:gap-3">
          {[
            ["1000", "Atividades"],
            ["100", "Histórias"],
            ["3", "Idades"],
          ].map(([n, l]) => (
            <div key={l} className="rounded-2xl bg-card px-3 sm:px-4 py-2 sm:py-3 shadow-soft flex-1 sm:flex-initial">
              <div className="font-display text-3xl sm:text-4xl font-bold text-grape">{n}</div>
              <div className="text-[11px] sm:text-xs font-extrabold uppercase text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 sm:mt-5 font-display text-[15px] sm:text-lg font-semibold text-ink">Páginas reais · arraste para o lado →</p>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-0 sm:px-6">
        <MaterialCarousel />
      </div>

      <div className={`${W} mt-4`}>
        <CTA className="material-cta-pulse">Quero esse material</CTA>
      </div>

      {/* Provas Sociais — Substitui exclusivamente o vídeo 'Na mesa de casa' dentro da área amarela */}
      <div className="mt-10 sm:mt-14 w-full">
        <div className={`${W} text-center`}>
          <h3 className="text-[1.65rem] min-[360px]:text-[1.85rem] sm:text-[2.2rem] font-bold leading-tight text-navy uppercase font-display">
            Quem conhece, se{" "}
            <span className="relative inline-block rounded-[10px] sm:rounded-[14px] bg-navy px-[0.35em] pt-[0.08em] pb-[0.14em] text-sun shadow-sm">
              encanta! 💛
            </span>
          </h3>
          <p
            style={{ fontFamily: "'Poppins', sans-serif" }}
            className="mt-2.5 sm:mt-3 inline-block w-[calc(100%-52px)] sm:w-auto max-w-[340px] sm:max-w-[440px] mx-auto rounded-[14px] bg-[#FFF9E9] px-4 py-2 sm:px-5 sm:py-2.5 font-poppins text-[15px] sm:text-[16.5px] font-medium text-[#101C4B] leading-snug text-center"
          >
            Veja o que nossos clientes estão dizendo sobre as atividades!
          </p>
        </div>

        <div className="w-full max-w-[1440px] mx-auto px-0 sm:px-6">
          <DepoimentosCarousel />
        </div>
      </div>
    </section>
  );
}

function Calculadora() {
  const isJesus = useAngulo() === "jesus";
  const [sel, setSel] = useState<string>("mes");
  const p = PERIODS.find((x) => x.id === sel)!;
  const r = calcPeriod(p.days);
  return (
    <section className={`bg-background ${isJesus ? "pt-7 pb-8 sm:py-12" : "py-12"}`}>
      <div className={`${W} text-center`}>
        <h2 className="text-[1.65rem] min-[360px]:text-[1.8rem] sm:text-[2.1rem] font-bold leading-snug sm:leading-tight text-ink max-w-[440px] mx-auto text-balance">
          {isJesus ? (
            <>
              Veja quantos momentos com <span className="hl">Jesus</span> você pode criar!
            </>
          ) : (
            <>
              Veja quanto tempo de tela pode virar <span className="hl">Bíblia</span>
            </>
          )}
        </h2>
        <p className="mt-2.5 sm:mt-3 text-[15.5px] sm:text-lg text-muted-foreground">Com 1 atividade de 10 minutos por dia:</p>
        <div className="mt-4 sm:mt-5 grid grid-cols-4 gap-2">
          {PERIODS.map((x) => (
            <button
              key={x.id}
              onClick={() => setSel(x.id)}
              className={`rounded-xl border-2 py-2 sm:py-2.5 text-[14px] min-[360px]:text-[15px] font-extrabold transition ${
                sel === x.id ? "border-grape bg-grape text-accent-foreground" : "border-lavender bg-lilac text-grape"
              }`}
            >
              {x.label}
            </button>
          ))}
        </div>
        <div className="mt-4 sm:mt-5 grid grid-cols-3 gap-1.5 sm:gap-2 rounded-3xl bg-grape-grad px-2.5 sm:px-4 py-5 sm:py-6 text-accent-foreground shadow-soft">
          {[
            [r.activities, "atividades feitas"],
            [r.hours, isJesus ? "aprendendo sobre Jesus" : "juntos, longe da tela"],
            [r.stories, isJesus ? "momentos com Jesus" : "histórias bíblicas"],
          ].map(([n, l]) => (
            <div key={String(l)} className="flex flex-col items-center justify-start text-center">
              <div className="font-display text-3xl sm:text-4xl font-bold text-sun leading-none">{n}</div>
              <div className="mt-1.5 text-[12.5px] min-[360px]:text-[13px] sm:text-sm font-bold leading-tight max-w-[110px] mx-auto">
                {l}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 sm:mt-5 text-[14.5px] sm:text-base font-medium text-muted-foreground">
          {isJesus
            ? "E o melhor: são 1.000 atividades bíblicas!"
            : "E ainda sobra material: são 1000 atividades."}
        </p>
      </div>
    </section>
  );
}

function AntesDepois() {
  const isJesus = useAngulo() === "jesus";

  const antesCelular = [
    '"Só mais 5 minutinhos" no tablet',
    "Choro e birra quando tira a tela",
    "Bíblia infantil largada em 2 minutos",
    "Você sem energia para inventar brincadeira",
  ];
  const depoisCelular = [
    "Uma folha na mesa e um lápis de cor",
    "Atividade do tamanho da idade dele",
    "Ele termina, se sente capaz e pede outra",
    "10 minutos de história bíblica juntos",
  ];

  const antesJesus = [
    "Você quer ensinar sobre Jesus, mas não sabe como",
    "Seu filho perde o interesse rapidinho",
    "É difícil explicar as histórias da Bíblia",
    "Faltam ideias de atividades divertidas",
  ];
  const depoisJesus = [
    "Seu filho aprende sobre Jesus brincando",
    "Histórias bíblicas viram atividades divertidas",
    "Ele colore, descobre e aprende",
    "10 minutos especiais com Deus todos os dias",
  ];

  const antes = isJesus ? antesJesus : antesCelular;
  const depois = isJesus ? depoisJesus : depoisCelular;

  const Card = ({
    title,
    tone,
    items,
    mark,
    imgSrc,
    imgAlt,
  }: {
    title: string;
    tone: string;
    items: string[];
    mark: ReactNode;
    imgSrc: string;
    imgAlt: string;
  }) => (
    <div className="overflow-hidden rounded-3xl bg-card shadow-soft flex flex-col">
      <div className={`${tone} py-2 text-center font-display text-lg font-bold text-primary-foreground`}>{title}</div>
      <img
        src={imgSrc}
        alt={imgAlt}
        style={{ aspectRatio: "420/524" }}
        className="w-full object-cover object-center block"
        loading="lazy"
      />
      <ul className="space-y-2 p-2.5 sm:p-3 text-[13.5px] min-[360px]:text-[14px] sm:text-[15px] font-bold leading-snug text-ink flex-1">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span className="shrink-0">{mark}</span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <section className="bg-cream py-12">
      <div className={W}>
        <h2 className="text-center font-display text-[1.45rem] min-[360px]:text-[1.65rem] min-[390px]:text-[1.8rem] sm:text-[2.1rem] font-bold uppercase leading-tight text-ink text-balance">
          PRENDER A ATENÇÃO DAS CRIANÇAS NÃO É FÁCIL!
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Card
            title="ANTES"
            tone="bg-red"
            items={antes}
            mark={<span className="text-red">×</span>}
            imgSrc="/antes.webp"
            imgAlt="Criança no tablet e adulto"
          />
          <Card
            title="DEPOIS"
            tone="bg-go"
            items={depois}
            mark={<span className="text-go">✓</span>}
            imgSrc="/depois.webp"
            imgAlt="Criança pintando atividade"
          />
        </div>
        <div className="mt-6 -rotate-1 rounded-3xl bg-sun px-5 py-6 text-center font-display text-[1.35rem] min-[360px]:text-[1.45rem] sm:text-[1.6rem] font-bold leading-tight text-navy shadow-soft text-balance">
          {isJesus
            ? "Não basta contar histórias sobre Jesus. É preciso despertar o interesse das crianças!"
            : "O problema não é tirar a tela. É ter o que colocar no lugar."}
        </div>
        <div className="mt-6">
          <CTA className={`lugar-cta-pulse ${isJesus ? "text-[1.15rem] min-[360px]:text-[1.25rem] sm:text-[1.35rem]" : ""}`}>
            {isJesus ? "Quero prender a atenção das crianças!" : "Quero colocar a Bíblia no lugar"}
          </CTA>
        </div>
      </div>
    </section>
  );
}

function Escada() {
  const levels = [
    {
      age: "2 a 4 anos",
      tone: "bg-pinkish",
      t: "Primeiros passos",
      d: "Colorir, ligar pontos e labirintos curtos. Para quem ainda não lê.",
      imgSrc: "/faixa-2-4.jpg",
      imgAlt: "Menina segurando atividade colorida da Arca de Noé",
    },
    {
      age: "5 a 7 anos",
      tone: "bg-orange",
      t: "Primeiras palavras",
      d: "Caça-palavras fáceis, labirintos e primeiras cruzadinhas.",
      imgSrc: "/faixa-5-7.jpg",
      imgAlt: "Duas crianças realizando atividades bíblicas na mesa",
    },
    {
      age: "8 a 10 anos",
      tone: "bg-sky",
      t: "Pequenos desafios",
      d: "Cruzadinhas e perguntas, com a passagem bíblica para conferir.",
      imgSrc: "/faixa-8-10.jpg",
      imgAlt: "Menino segurando atividade de Davi e Golias",
    },
  ];
  return (
    <section className="bg-navy-grad py-12 text-primary-foreground">
      <div className={`${W} text-center`}>
        <h2 className="text-[2.3rem] font-bold leading-tight">
          Uma escada, <span className="hl">três degraus</span>
        </h2>
        <p className="mt-3 text-lg opacity-85">
          As mesmas 100 histórias, em três níveis. Irmãos de idades diferentes fazem a mesma história juntos.
        </p>
        <div className="mt-6 space-y-4">
          {levels.map((l) => (
            <div key={l.age} className="flex items-start gap-3.5 rounded-3xl bg-card p-3 text-left text-ink shadow-soft">
              <div className="w-[42%] shrink-0 overflow-hidden rounded-2xl">
                <img
                  src={l.imgSrc}
                  alt={l.imgAlt}
                  style={{ aspectRatio: "420 / 524" }}
                  className="w-full h-auto object-cover object-center block"
                  loading="lazy"
                />
              </div>
              <div className="pt-1 min-w-0">
                <span className={`${l.tone} inline-block rounded-xl px-3 py-1 font-display text-[15px] sm:text-base font-bold text-primary-foreground`}>
                  {l.age}
                </span>
                <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold leading-tight text-navy">
                  {l.t}
                </h3>
                <p className="mt-1.5 text-[14px] sm:text-[15px] leading-snug text-muted-foreground">
                  {l.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Simples() {
  const steps = [
    {
      n: "1",
      t: "ESCOLHA",
      d: "a história e a idade",
      src: "/passo-escolha.jpg",
      alt: "Folhas de atividades bíblicas",
    },
    {
      n: "2",
      t: "IMPRIMA",
      d: "em qualquer impressora",
      src: "/passo-imprima.jpg",
      alt: "Impressora imprimindo atividade bíblica",
    },
    {
      n: "3",
      t: "JUNTOS",
      d: "10 minutos por dia",
      src: "/passo-juntos.jpg",
      alt: "Mãe e filho pintando juntos atividade bíblica",
    },
  ];
  return (
    <section className="bg-cream py-12">
      <div className={W}>
        <h2 className="text-center font-display text-[2.1rem] sm:text-[2.3rem] font-bold text-ink">
          Simples assim
        </h2>
        <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-4 text-center">
          {steps.map((s) => (
            <div key={s.n} className="flex flex-col items-center">
              <div className="w-full overflow-hidden rounded-2xl border-4 sm:border-[5px] border-card bg-card shadow-soft">
                <img
                  src={s.src}
                  alt={s.alt}
                  className="w-full aspect-square object-cover block"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 flex items-center justify-center gap-1 sm:gap-1.5">
                <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-orange text-xs sm:text-sm font-extrabold text-primary-foreground shrink-0">
                  {s.n}
                </span>
                <span className="font-display text-[13px] min-[390px]:text-[15px] sm:text-lg font-black uppercase text-grape tracking-wide">
                  {s.t}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-muted-foreground leading-snug">
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Perfeito() {
  const items = ["👨‍👩‍👧 Famílias", "👵 Avós", "⛪ Ministério infantil", "📚 Escola bíblica", "🍎 Professoras", "🏠 Células e encontros"];
  return (
    <section className="bg-blush py-12">
      <div className={W}>
        <h2 className="text-center text-[2.3rem] font-bold text-ink">Perfeito para...</h2>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {items.map((i) => (
            <div key={i} className="rounded-2xl bg-card px-4 py-4 font-display text-lg font-bold leading-snug text-ink shadow-soft">
              {i}
            </div>
          ))}
        </div>
        <div className="mt-5 overflow-hidden rounded-3xl border-[6px] border-card bg-card shadow-soft">
          <img
            src="/professora-sala.jpg"
            alt="Professora contando história bíblica em sala de aula"
            style={{ aspectRatio: "3 / 4" }}
            className="w-full h-auto object-cover object-center block"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

const BONUS = [
  {
    book: "1000 Esboços de Aula",
    q: "Não sei ensinar",
    d: "Esboços de aula para cada história",
    src: "/bonus-esbocos.jpg",
    alt: "Capa: 1000 Esboços de Aula",
  },
  {
    book: "1000 Perguntas Bíblicas",
    q: "Ele esquece a história",
    d: "Perguntas bíblicas para cada história",
    src: "/bonus-perguntas.jpg",
    alt: "Capa: 1000 Perguntas Bíblicas",
  },
  {
    book: "100 Histórias Ilustradas",
    q: "Não conheço as histórias",
    d: "100 histórias ilustradas",
    src: "/bonus-historias.jpg",
    alt: "Capa: 100 Histórias Ilustradas",
  },
  {
    book: "100 Dinâmicas em Grupo",
    q: "Minha turma é grande",
    d: "100 dinâmicas em grupo",
    src: "/bonus-dinamicas.jpg",
    alt: "Capa: 100 Dinâmicas em Grupo",
  },
  {
    book: "Natal e Ano Novo Bíblico",
    q: "E no fim de ano?",
    d: "Natal e Ano Novo Bíblico",
    price: "R$ 9,90",
    src: "/bonus-natal.jpg",
    alt: "Capa: Natal e Ano Novo Bíblico",
  },
  {
    book: "Devocional em Família",
    q: "Quero um hábito",
    d: "Devocional em Família · 52 semanas",
    price: "R$ 14,90",
    src: "/bonus-devocional.jpg",
    alt: "Capa: Devocional em Família",
  },
];

function Bonus() {
  return (
    <section className="bg-cream py-12">
      <div className={`${W} text-center`}>
        <span className="inline-block rounded-full bg-orange px-5 py-2 font-display text-sm font-bold uppercase text-primary-foreground">
          🎁 No pacote completo
        </span>
        <h2 className="mt-3 text-[2.3rem] font-bold text-ink">E não para por aí...</h2>
        <p className="mt-2 text-lg text-muted-foreground">Cada bônus resolve uma desculpa.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
          {BONUS.map((b) => (
            <div key={b.book} className="relative flex flex-col items-center rounded-3xl border-2 border-beige bg-card p-3 sm:p-4 text-center shadow-soft">
              {b.price && (
                <span className="absolute -right-1 -top-3 z-10 rotate-6 rounded-xl bg-sun px-3 py-1 font-display text-xs sm:text-sm font-black text-navy shadow-sm">
                  vale {b.price}
                </span>
              )}
              <div className="w-full overflow-hidden rounded-2xl bg-white border border-border/40">
                <img
                  src={b.src}
                  alt={b.alt}
                  className="w-full aspect-square object-contain block"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-[11px] min-[390px]:text-xs font-black uppercase tracking-wide text-orange">
                "{b.q}"
              </p>
              <p className="mt-1 text-[13.5px] min-[390px]:text-[14.5px] sm:text-[16px] font-bold leading-snug text-ink">
                {b.d}
              </p>
              {b.price && (
                <p className="mt-1.5 font-extrabold text-red line-through text-sm sm:text-base">
                  {b.price}
                </p>
              )}
              <div className="mt-auto pt-3">
                <span className="inline-block rounded-full bg-go px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-extrabold text-primary-foreground shadow-sm">
                  GRÁTIS no Completo
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pacotes() {
  const full = [
    <><b>1000 atividades</b> por idade (2 a 10 anos)</>,
    <>Esboços de aula para cada história</>,
    <>Perguntas bíblicas para cada história</>,
    <>100 histórias ilustradas</>,
    <>100 dinâmicas em grupo</>,
    <>Natal e Ano Novo Bíblico <s className="font-bold text-red">R$ 9,90</s></>,
    <>Devocional em Família, 52 semanas <s className="font-bold text-red">R$ 14,90</s></>,
  ];
  const off = ["Esboços de aula", "Perguntas bíblicas", "Histórias ilustradas", "Dinâmicas em grupo", "Natal e Ano Novo", "Devocional 52 semanas"];
  return (
    <section id="pacotes" className="scroll-mt-4 bg-lavender py-12">
      <div className={W}>
        <h2 className="text-center text-[2.3rem] font-bold text-ink">Escolha seu pacote</h2>
        <p className="mt-2 text-center text-lg text-muted-foreground">Pagamento único. Sem mensalidade. Seu para sempre.</p>

        <div className="relative mt-10 overflow-visible rounded-3xl border-4 border-sun bg-card shadow-soft">
          <span className="absolute -top-5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-sun px-5 py-2 font-display font-bold uppercase text-navy">
            ⭐ Mais vantajoso
          </span>
          <div className="rounded-t-[1.3rem] bg-grape-grad px-4 pb-4 pt-8 text-center text-accent-foreground">
            <h3 className="text-3xl font-bold">Pacote Completo</h3>
            <p className="mt-1 font-bold">7 materiais por menos de R$ 3,60 cada</p>
          </div>
          <div className="px-5 pb-6">
            <div className="mx-auto mt-4 sm:mt-5 w-[82%] sm:w-[75%] overflow-hidden rounded-2xl">
              <img
                src="/mockup-5-livros.jpg"
                alt="Mockup: 5 livros Escadinha da Fé"
                className="w-full aspect-square object-contain block"
                loading="lazy"
              />
            </div>
            <div className="mt-3 text-center font-display text-6xl font-bold text-go">R$ 24,90</div>
            <p className="mt-1 text-center font-bold text-muted-foreground">
              Separado, só o Natal e o Devocional já custam R$ 24,80
            </p>
            <ul className="mt-4">
              {full.map((f, i) => (
                <li key={i} className="border-b-2 border-dashed border-beige py-3 text-[17px] last:border-0">
                  ✅ {f}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <CTA
                href={CHECKOUT_COMPLETO}
                onClick={() => checkout(CHECKOUT_COMPLETO)}
                className="pacote-completo-pulse"
              >
                Quero o pacote completo
              </CTA>
            </div>
            <p className="mt-4 text-center text-sm font-bold text-muted-foreground">
              🔒 Compra segura pela Kiwify · Pix ou cartão · Acesso na hora
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl bg-card shadow-soft">
          <div className="bg-slate-lilac py-4 text-center font-display text-3xl font-bold text-primary-foreground">
            Pacote Básico
          </div>
          <div className="px-5 pb-6">
            <div className="py-3 text-center font-display text-5xl font-bold text-ink">R$ 12</div>
            <ul>
              <li className="border-b-2 border-dashed border-beige py-3 text-[17px]">✅ 1000 atividades por idade</li>
              {off.map((o) => (
                <li key={o} className="border-b-2 border-dashed border-beige py-3 text-[17px] text-muted-foreground last:border-0">
                  <span className="font-extrabold text-red">❌</span> <s>{o}</s>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <a
                href={CHECKOUT_BASICO}
                onClick={(e) => {
                  e.preventDefault();
                  // Usa o href atual do link, que a Utmify enriquece com os UTMs do anúncio
                  checkout(e.currentTarget.href || CHECKOUT_BASICO);
                }}
                className="btn-beige cursor-pointer"
              >
                Quero só as atividades
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Garantia() {
  return (
    <section className="bg-cream py-12">
      <div className={W}>
        <div className="flex items-center gap-4 rounded-3xl border-4 border-go bg-card p-5 shadow-soft">
          <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full bg-go text-primary-foreground ring-8 ring-go/20">
            <span className="font-display text-4xl font-bold leading-none">7</span>
            <span className="text-xs font-extrabold">DIAS</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-ink">Garantia de 7 dias</h3>
            <p className="mt-1 leading-snug text-ink">
              Imprima, use com seu filho e veja se ele gosta. Se não for para vocês, peça pelo e-mail e devolvemos
              100%, sem precisar justificar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQS: [string, ReactNode][] = [
  ["Como recebo?", "Logo após a confirmação do pagamento, o acesso ao material é enviado para o seu e-mail."],
  ["É material físico?", "Não. É um material digital em PDF, para você imprimir em casa quantas vezes quiser."],
  ["Preciso de impressora colorida?", "Não. As atividades funcionam em qualquer impressora, inclusive preto e branco."],
  ["Meu filho é muito pequeno. Ele consegue?", "Sim. Há atividades separadas para 2 a 4 anos, como colorir, ligar pontos e labirintos curtos, pensadas para quem ainda não lê."],
  ["Preciso saber ensinar a Bíblia?", "Não. Cada atividade traz a referência da passagem bíblica, e o Pacote Completo inclui esboços de aula para cada história."],
  ["Quantas vezes posso imprimir?", "Quantas quiser, para seus filhos ou para a turma toda."],
  ["Posso usar na igreja?", "Pode. Foi feito pensando também no ministério infantil."],
  ["O conteúdo é fiel à Bíblia?", "Cada atividade traz a referência da passagem, para você conferir."],
  ["É mensalidade?", "Não. Pagamento único, acesso para sempre."],
  ["E se não gostar?", "Você tem 7 dias de garantia. Devolvemos 100% do valor."],
  ["A compra é segura?", "Sim. O pagamento é feito pela Kiwify, uma das maiores plataformas de produtos digitais do Brasil."],
  [
    "Com quem falo se tiver dúvida?",
    <>
      Em caso de dúvidas, entre em contato pelo nosso e-mail de atendimento:{" "}
      <a
        href="mailto:prjg200023@gmail.com"
        className="underline font-semibold hover:opacity-80 transition-opacity"
      >
        prjg200023@gmail.com
      </a>
    </>,
  ],
];

function FAQ() {
  return (
    <section className="bg-background py-12">
      <div className={W}>
        <h2 className="text-center text-[2.3rem] font-bold text-ink">Perguntas frequentes</h2>
        <div className="mt-6 space-y-3">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group rounded-3xl border-2 border-beige bg-cream px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center gap-2.5 font-display text-[17px] sm:text-lg font-bold text-navy [&::-webkit-details-marker]:hidden">
                <span className="inline-block text-[11px] sm:text-xs transition-transform duration-200 group-open:rotate-90">▶</span>
                <span>{q}</span>
              </summary>
              <p className="mt-2.5 pl-5 sm:pl-6 text-[15px] sm:text-base leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-top-1">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Final() {
  return (
    <section className="bg-navy-grad py-14 text-primary-foreground">
      <div className={`${W} text-center`}>
        <h2 className="text-[2.5rem] font-bold leading-tight">
          Hoje à noite pode ser o <span className="hl">Dia 1</span>
        </h2>
        <p className="mt-4 text-lg opacity-90">
          Uma folha na mesa, um lápis de cor e uma história da Bíblia do tamanho do seu filho.
        </p>
        <div className="mt-6">
          <CTA className="final-cta-pulse">Quero começar hoje</CTA>
        </div>
        <p className="mt-5 opacity-75">
          P.S.: 10 minutos por dia é tudo o que separa o "só mais 5 minutinhos" de uma criança que senta, termina a
          atividade e pede a próxima.
        </p>
      </div>
    </section>
  );
}

function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("material");
    if (!target) return;

    const checkVisibility = () => {
      const rect = target.getBoundingClientRect();
      // Aparece exatamente quando a seção amarela estiver na parte superior da tela (como na referência)
      const reached = rect.top <= Math.min(320, window.innerHeight * 0.4);
      setVisible(reached);
    };

    const observer = new IntersectionObserver(
      () => {
        checkVisibility();
      },
      {
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    observer.observe(target);
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility, { passive: true });

    checkVisibility();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 bg-navy px-3.5 sm:px-4 pt-2 sm:pt-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={goPricing}
        className="mx-auto flex w-full max-w-[480px] items-center justify-between rounded-2xl bg-go px-4 sm:px-5 py-2.5 sm:py-3 font-display text-primary-foreground shadow-md transition-transform active:scale-[0.98] cursor-pointer"
      >
        <span className="text-[14.5px] sm:text-[15.5px] font-bold tracking-tight">
          Quero as atividades
        </span>
        <span className="text-[12.5px] sm:text-[13.5px] font-semibold opacity-95">
          a partir de R$ 12
        </span>
      </button>
    </div>
  );
}
