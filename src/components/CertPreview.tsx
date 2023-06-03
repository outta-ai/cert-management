"use client";

import { useEffect, useState } from "react";

import { Canvas, Image, Rect, Text } from "fabric";
import NextImage from "next/image";

import { CertContent } from "types/content";

type Props = {
  content: string;
};

export default function CertPreview({ content }: Props) {
  const [preview, setPreview] = useState("");

  const certContent = JSON.parse(content) as CertContent;

  const canvasWidth = certContent.orientation === "landscape" ? 1024 : 720;
  const canvasHeight = certContent.orientation === "landscape" ? 720 : 1024;

  useEffect(() => {
    const canvas = new Canvas("canvas-hidden", {
      width: canvasWidth,
      height: canvasHeight,
    });

    (async () => {
      const imageResponse = await fetch(
        `/api/images/${certContent.image.data}`
      );
      const imageBlob = await imageResponse.blob();
      const image = await Image.fromURL(URL.createObjectURL(imageBlob));

      image.set("width", certContent.image.width);
      image.set("height", certContent.image.height);
      image.set("left", certContent.image.left);
      image.set("top", certContent.image.top);
      canvas.add(image);

      canvas.sendObjectToBack(image);

      canvas.renderAll();

      setPreview(canvas.toDataURL());
    })();

    certContent.texts.forEach((text) => {
      const textObject = new Text(text.data, {
        scaleX: text.scale,
        scaleY: text.scale,
        left: text.left,
        top: text.top,
        fontFamily: "Pretended Variable",
      });
      canvas.add(textObject);
    });

    certContent.rects.forEach((rect) => {
      const rectObject = new Rect({
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
        fill: "#FF0000",
      });
      canvas.add(rectObject);
    });

    return () => {
      canvas.dispose();
    };
  }, [content]);

  return (
    <>
      <NextImage
        className={`mt-3 ${preview ? "" : "hidden"}`}
        src={preview}
        alt="Certificate Preview"
        width={canvasWidth}
        height={canvasHeight}
      />
      <div className="hidden">
        <canvas id="canvas-hidden" className="hidden" width={720} />
      </div>
    </>
  );
}
