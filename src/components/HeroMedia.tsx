/**
 * Renders a CMS media asset that may be a still image or a short looping
 * video (PNG / JPG / GIF / MP4 / WebM). Decorative only — muted, autoplay,
 * looping, no controls.
 */
export default function HeroMedia({
  url,
  mime,
  className,
}: {
  url: string;
  mime?: string | null;
  className?: string;
}) {
  if (mime?.startsWith("video/")) {
    return (
      <video
        className={className}
        src={url}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={url} alt="" aria-hidden="true" />;
}
