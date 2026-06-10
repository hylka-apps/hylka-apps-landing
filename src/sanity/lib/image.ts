import { createImageUrlBuilder } from "@sanity/image-url";
import { getSanityClient } from "./client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return createImageUrlBuilder(getSanityClient()).image(source);
}
