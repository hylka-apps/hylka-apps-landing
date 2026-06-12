"use client";

/**
 * In-page anchor that smooth-scrolls the target to the centre of the viewport
 * (instead of jamming it under the fixed header) and still updates the URL hash
 * so the `:target` highlight fires. Falls back to a normal anchor when JS is off.
 */
export default function AnchorLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = document.querySelector(href);
    if (!el) return; // let the browser handle it
    e.preventDefault();
    history.pushState(null, "", href);
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    // pushState doesn't trigger :target, so flash via a class with an
    // animation restart (remove → reflow → add).
    el.classList.remove("is-flash");
    void (el as HTMLElement).offsetWidth;
    el.classList.add("is-flash");
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
