export type CertContent = {
  image: {
    data: string;
    width: number;
    height: number;
    left: number;
    top: number;
  };
  texts: {
    data: string;
    scale: number;
    left: number;
    top: number;
  }[];
  rects: {
    width: number;
    height: number;
    left: number;
    top: number;
  }[];
  orientation: "landscape" | "portrait";
};
