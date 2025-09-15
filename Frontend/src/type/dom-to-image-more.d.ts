// src/types/dom-to-image-more.d.ts
declare module "dom-to-image-more" {
  export interface Options {
    quality?: number;
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: Partial<CSSStyleDeclaration>;
    filter?: (node: HTMLElement) => boolean;
    // allow any additional keys without TypeScript errors
    [key: string]: unknown;
  }

  const domtoimage: {
    toPng(node: HTMLElement, options?: Options): Promise<string>;
    toJpeg(node: HTMLElement, options?: Options): Promise<string>;
    toSvg(node: HTMLElement, options?: Options): Promise<string>;
    toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
    // fallback for any other exported function
    [key: string]: unknown;
  };

  export default domtoimage;
  export as namespace domtoimage;
}
