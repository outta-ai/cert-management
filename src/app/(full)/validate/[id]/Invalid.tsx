import Header from "./Header";

import IconCircleX from "assets/icons/icon_circle-x.svg";

export default function InvalidPage() {
  return (
    <div>
      <Header />
      <main className="w-full max-w-lg mx-auto m-12 p-6">
        <div className="flex flex-col sm:flex-row items-center">
          <IconCircleX className="w-20 h-20 fill-red-500 shrink-0" />
          <div className="w-6 h-6" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-center sm:text-left">
              유효하지 않은 증명서입니다.
            </h2>
            <p>
              자세한 사항은{" "}
              <a
                href="mailto:contact@outta.ai"
                className="text-blue-500 underline"
              >
                OUTTA
              </a>
              로 문의해 주세요
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
