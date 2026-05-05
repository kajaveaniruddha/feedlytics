"use client";

import * as React from "react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export type WorkspaceUpdateSlide = {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  visual: React.ReactNode;
  /** Tailwind gradient / background classes for the slide shell */
  shellClassName: string;
  /** Optional CTA text color (pill stays white); e.g. `text-brand-900` */
  ctaClassName?: string;
};

export type WorkspaceUpdatesCarouselProps = {
  slides: WorkspaceUpdateSlide[];
  /** Accessible name for the carousel region */
  "aria-label"?: string;
};

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function SlideCta({
  href,
  children,
  ctaClassName,
}: {
  href: string;
  children: React.ReactNode;
  ctaClassName?: string;
}) {
  const className = cn(
    buttonVariants({ variant: "bannerCta", size: "lg" }),
    "mt-[18px] inline-flex text-center no-underline",
    ctaClassName,
  );
  if (isExternalHref(href)) {
    return (
      <a href={href} className={className} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function WorkspaceUpdatesCarousel({
  slides,
  "aria-label": ariaLabel = "Workspace updates",
}: WorkspaceUpdatesCarouselProps) {
  const [index, setIndex] = React.useState(0);
  const count = slides.length;

  if (count === 0) {
    return null;
  }

  const safeIndex = Math.min(index, count - 1);

  return (
    <section
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      className="relative overflow-hidden rounded-[20px] shadow-card dark:shadow-none"
      role="region"
    >
      <div className="overflow-hidden">
        <div
          aria-live="polite"
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <article
              key={slide.id}
              className={cn(
                "relative min-w-full overflow-hidden py-8 px-7 pb-11 text-white",
                slide.shellClassName,
              )}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-[40%] -right-[5%] size-[260px] rounded-full bg-white/[0.06]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-[50%] right-[15%] size-[200px] rounded-full bg-white/[0.04]"
              />
              <div className="relative z-[1] flex min-h-0 items-center justify-between gap-0">
                <div className="min-w-0 flex-1">
                  <h2 className="mb-2 text-2xl leading-tight font-bold whitespace-pre-line">
                    {slide.title}
                  </h2>
                  <p className="max-w-[320px] text-[13px] leading-relaxed text-white/85">
                    {slide.description}
                  </p>
                  <SlideCta href={slide.href} ctaClassName={slide.ctaClassName}>
                    {slide.ctaLabel}
                  </SlideCta>
                </div>
                <div className="relative z-[1] ml-6 shrink-0">{slide.visual}</div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div
        className="pointer-events-auto absolute right-0 bottom-4 left-0 z-10 flex justify-center gap-2"
        aria-label="Carousel pagination"
        role="group"
      >
        {slides.map((slide, i) => {
          const active = i === safeIndex;
          return (
            <button
              key={slide.id}
              type="button"
              aria-current={active ? "true" : undefined}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-2 cursor-pointer border-0 p-0 shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out",
                "hover:scale-110 hover:bg-white/75",
                active
                  ? "w-6 rounded bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
                  : "size-2 rounded-full bg-white/50",
              )}
              onClick={() => setIndex(i)}
            />
          );
        })}
      </div>
    </section>
  );
}
