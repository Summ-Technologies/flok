export type ImageModel = {
  url: string
  alt: string
  orientation: "landscape" | "portrait"
}

export const sampleLandscape: ImageModel = {
  url: "https://flok-b32d43c.s3.us-east-1.amazonaws.com/misc/david-vives-ELf8M_YWRTY-unsplash.jpg",
  orientation: "landscape",
  alt: "",
}
export const samplePortrait: ImageModel = {
  url: "https://images.unsplash.com/photo-1611005813863-6c1bc3d3908b",
  orientation: "portrait",
  alt: "",
}
