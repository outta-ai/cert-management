"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Canvas, IText, Image, Rect } from "fabric";

import IconFile from "assets/icons/icon_file.svg";
import IconHorizontal from "assets/icons/icon_horizontal.svg";
import IconQrCode from "assets/icons/icon_qrcode.svg";
import IconText from "assets/icons/icon_text.svg";
import IconVertical from "assets/icons/icon_vertical.svg";

export default function Form() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fabricRef = useRef<Canvas>();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [orientation, setOrientation] = useState<"landscape" | "portrait">(
    "portrait"
  );
  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    const canvasWidth = orientation === "landscape" ? 1024 : 720;
    const canvasHeight = orientation === "landscape" ? 720 : 1024;

    const canvas = new Canvas("canvas-main", {
      width: canvasWidth,
      height: canvasHeight,
    });
    fabricRef.current = canvas;

    if (file) {
      (async () => {
        const image = await Image.fromURL(URL.createObjectURL(file));
        image.lockMovementX = true;
        image.lockMovementY = true;
        image.lockScalingX = true;
        image.lockScalingY = true;
        image.lockRotation = true;
        image.selectable = false;
        image.hasControls = false;

        if (image.width > image.height) {
          // Center and adjust width and height to fit in the canvas
          // image.left is calulated by the center of the image
          image.scaleToWidth(canvas.width);
        } else {
          // Center and adjust width and height to fit in the canvas
          image.scaleToHeight(canvas.height);
        }

        canvas.add(image);
        canvas.centerObject(image);
        setImageHeight(image.height ?? 0);
      })();
    }

    return () => {
      canvas.dispose();
    };
  }, [orientation, file]);

  const addText = useCallback(() => {
    const text = new IText("여기에 텍스트 입력", {});
    fabricRef.current?.add(text);
    fabricRef.current?.bringObjectToFront(text);
  }, [fabricRef.current]);

  const addQrCode = useCallback(() => {
    const rect = new Rect({
      width: 100,
      height: 100,
      fill: "red",
    });
    fabricRef.current?.add(rect);
    fabricRef.current?.bringObjectToFront(rect);
  }, [fabricRef.current]);

  return (
    <div className="w-full" ref={rootRef}>
      <div className="mt-3">
        <p>
          <span className="font-semibold">1.</span> 증명서 배경을 선택해 주세요
        </p>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          accept="image/*"
        />
        <div className="mt-3 flex relative">
          <div className="absolute rounded-l-md flex w-10 h-10 justify-center items-center bg-gray-300">
            <IconFile className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="flex-1 h-10 rounded-md border-gray-300 border p-2 pl-12 focus:outline-none cursor-pointer"
            readOnly
            value={file?.name ?? "파일 선택"}
            onChange={() => {}} // do nothing
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
          />
        </div>
      </div>
      <div className={`mt-3 ${file ? "block" : "hidden"}`}>
        <p>
          <span className="font-semibold">2.</span> 증명서 내용을 입력해 주세요
        </p>
        <div className="flex items-center">
          <p>
            &#123;&#123;Name&#125;&#125;, &#123;&#123;IssueDate&#125;&#125;,
            &#123;&#123;PrintDate&#125;&#125; 등으로 날짜와 이름를 입력할 수
            있습니다.
          </p>
          <div className="flex-1" />
          <button
            type="button"
            className={`rounded-l-md ${
              orientation === "portrait"
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-gray-400 hover:bg-gray-500"
            }  p-2`}
            onClick={() => setOrientation("landscape")}
          >
            <IconHorizontal className="w-5 h-5" />
          </button>
          <button
            type="button"
            className={`rounded-r-md ${
              orientation === "landscape"
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-gray-400 hover:bg-gray-500"
            } p-2`}
            onClick={() => setOrientation("portrait")}
          >
            <IconVertical className="w-5 h-5" />
          </button>
          <div className="w-3" />
          <button
            type="button"
            className="rounded-md bg-gray-200 hover:bg-gray-300 p-2"
            onClick={addText}
          >
            <IconText className="w-5 h-5" />
          </button>
          <div className="w-3" />
          <button
            type="button"
            className="rounded-md bg-gray-200 hover:bg-gray-300 p-2"
            onClick={addQrCode}
          >
            <IconQrCode className="w-5 h-5" />
          </button>
        </div>
        <canvas
          id="canvas-main"
          className="mt-3 mx-auto border border-gray-300"
          width={orientation === "landscape" ? 1024 : 720}
          height={orientation === "landscape" ? 720 : 1024}
        />
      </div>
    </div>
  );
}
