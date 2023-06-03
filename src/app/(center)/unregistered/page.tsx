export default async function UnregisteredPage() {
  return (
    <main className="w-full max-w-sm m-3 shadow-lg p-6">
      <header className="flex flex-row justify-center">
        <div className="block sm:flex">
          <p className="font-bold text-xl text-center sm:text-2xl sm:text-left">
            OUTTA
          </p>
          <p className="hidden sm:block">&nbsp;</p>
          <p className="font-bold text-xl text-center sm:text-2xl sm:text-left">
            증명서 발급센터
          </p>
        </div>
      </header>
      <p className="mt-6 font-semibold text-center break-keep">
        OUTTA에 등록되어 있지 않은 회원입니다.
      </p>
      <p className="mt-6 text-center break-keep">
        OUTTA 소속이거나 OUTTA의 부트캠프를 수강하셨는데도 불구하고 이 메시지가
        보인다면,{" "}
        <a href="mailto:users@outta.ai" className="text-blue-500 underline">
          OUTTA 관리자
        </a>
        에게 문의해주세요.
      </p>
      <a
        href="/login"
        className="mt-6 block w-full border border-gray-300 rounded-md text-center p-2"
      >
        다시 로그인하기
      </a>
    </main>
  );
}
