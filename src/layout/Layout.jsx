import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import RedBackdrop from "../components/RedBackdrop";
import TopFlourish from "../components/TopFlourish";

/**
 * Shared page frame: red backdrop, navbar, the current route, footer.
 * Scrolls to top on navigation.
 */
export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/home";
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* same background as the welcome scene; extends past the bottom edge */}
      <RedBackdrop className="fixed inset-x-0 top-0 -bottom-[20vh]" />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-gold focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar />
      {/* the home page gets the ornamental band, full width under the navbar */}
      {isHome && <TopFlourish />}
      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
