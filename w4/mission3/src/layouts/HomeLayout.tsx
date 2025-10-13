import { Outlet, useNavigate } from "react-router-dom";

const HomeLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더: 고정 높이 */}
      <nav className="fixed top-0 inset-x-0 z-10 bg-white/70 backdrop-blur-md border-b border-gray-200 h-16">
        <div className="h-full max-w-6xl mx-auto flex items-center justify-between px-6">
          <div
            onClick={() => navigate("/")}
            className="font-extrabold text-xl text-blue-700 cursor-pointer"
          >
            ZEEE HOMEPAGE
          </div>

          <div className="hidden md:flex gap-8 text-gray-600 font-medium">
            <button
              onClick={() => navigate("/")}
              className="hover:text-blue-600 transition"
            >
              홈
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 transition"
            >
              로그인
            </button>
            <button
              onClick={() => navigate("/my")}
              className="px-4 py-2 text-sm rounded-md bg-pink-500 text-white hover:bg-pink-600 transition"
            >
              마이페이지
            </button>
          </div>
        </div>
      </nav>

      {/* 메인: 헤더 높이만큼 패딩 + 정확한 최소 높이 + 중앙정렬 */}
      <main className="pt-16 min-h-[calc(100vh-4rem-4rem)] grid place-items-center">
        <Outlet />
      </main>

      {/* 푸터: 고정 높이 */}
      <footer className="h-16 flex items-center justify-center text-sm text-gray-400 border-t border-gray-200">
        © 2025 ZEEE
      </footer>
    </div>
  );
};

export default HomeLayout;
