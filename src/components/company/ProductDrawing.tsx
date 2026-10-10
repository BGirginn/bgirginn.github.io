import Image from "next/image";

type Drawing = {
  src: string;
  alt: string;
  caption: string;
};

export function ProductDrawing({ preview }: { preview: Drawing }) {
  return (
    <figure className="product-drawing">
      <Image src={preview.src} alt={preview.alt} width={800} height={580} />
      <figcaption>{preview.caption}</figcaption>
    </figure>
  );
}
