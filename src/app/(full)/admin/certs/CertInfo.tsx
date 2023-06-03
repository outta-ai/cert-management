"use client";
import { useEffect, useState } from "react";

import { Certificate, User } from "@prisma/client";
import { Canvas, Image, Rect, Text } from "fabric";
import NextImage from "next/image";
import { StringParam, useQueryParam } from "use-query-params";

import Pagination from "components/Pagination";

import IconClose from "assets/icons/icon_close.svg";

type ContentProps = {
  cert: Certificate;
  users: User[];
  onClose: () => void;
};

type CertContent = {
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

function CertInfoContent({ cert, users, onClose }: ContentProps) {
  const [userPage, setUserPage] = useState(1);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const certContent = JSON.parse(cert.content) as CertContent;

  const canvasWidth = certContent.orientation === "landscape" ? 1024 : 720;
  const canvasHeight = certContent.orientation === "landscape" ? 720 : 1024;

  useEffect(() => {
    const canvas = new Canvas("canvas-hidden", {
      width: canvasWidth,
      height: canvasHeight,
    });

    (async () => {
      const imageResponse = await fetch(
        `/api/images?id=${certContent.image.data}`
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
  }, [cert]);

  const deleteCert = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    setLoading(true);

    const response = await fetch(`/api/certs?id=${cert.id}`, {
      method: "DELETE",
    });

    setLoading(false);

    if (response.ok) {
      onClose();
    }
  };

  return (
    <>
      <div className="flex items-center">
        <IconClose className="w-6 h-6 cursor-pointer mr-3" onClick={onClose} />
        <h3 className="text-2xl font-bold">증명서</h3>
      </div>
      <div className="mt-3">
        <h4 className="text-lg font-semibold">이름</h4>
        <p>{cert.name}</p>
      </div>
      <div className="mt-3">
        <h4 className="text-lg font-semibold">발급 대상</h4>
        <div>
          {users
            .map((user) => (
              <div
                key={user.id}
                className="flex items-center p-2 border-b border-b-gray-100 last-of-type:border-b-0"
              >
                <p>
                  {user.name} ({user.email})
                </p>
              </div>
            ))
            .slice((userPage - 1) * 10, userPage * 10)}
        </div>
        <div className="w-full flex justify-center mt-3">
          <Pagination
            page={userPage}
            setPage={setUserPage}
            total={users.length}
          />
        </div>
      </div>
      <div className="mt-3">
        <h4 className="text-lg font-semibold">미리보기</h4>
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
      </div>
      <div className="flex-1" />
      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bggray-200 focus:bg-gray-300 rounded-md mr-3"
          disabled={loading}
          onClick={onClose}
        >
          취소
        </button>
        <div className="w-3 h-3" />
        <button
          type="button"
          className="px-4 py-2 bg-red-500 focus:bg-red-600 text-white rounded-md"
          disabled={loading}
          onClick={deleteCert}
        >
          삭제
        </button>
      </div>
    </>
  );
}

type Props = {
  users: User[];
  certs: Certificate[];
};

export default function CertInfo({ users, certs }: Props) {
  const [certId, setCertId] = useQueryParam("cert", StringParam);

  if (!certId || !certId.trim()) {
    return null;
  }

  const cert = certs.find((cert) => cert.id === certId);
  if (!cert) {
    return null;
  }

  const certUser = users.filter((user) => cert.userIds.includes(user.id));

  return (
    <div
      className="z-10 bg-black bg-opacity-50 fixed top-0 left-0 w-full h-screen cursor-default"
      onClick={() => setCertId(undefined)}
      onKeyDown={() => setCertId(undefined)}
    >
      <div
        className="absolute top-1/2 h-[50vh] right-0 w-full md:h-screen md:top-0 md:w-1/2 xl:w-1/3 overflow-y-auto bg-white z-20 p-6 flex flex-col pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <CertInfoContent
          cert={cert}
          users={certUser}
          onClose={() => setCertId(undefined)}
        />
      </div>
    </div>
  );
}
