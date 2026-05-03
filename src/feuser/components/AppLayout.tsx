import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import AppSidebar from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import gymBg from "@/assets/gym-bg.jpg";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Gym background image */}
      <div
        className="gym-bg"
        style={{ backgroundImage: `url(${gymBg})` }}
      />
      {/* Dark gradient overlay */}
      <div className="gym-bg-overlay" />
      {/* Animated gradient accent blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full animate-blob-1"
          style={{
            background: "radial-gradient(circle, hsla(359, 65%, 45%, 0.18) 0%, transparent 70%)",
            top: "10%",
            left: "5%",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full animate-blob-2"
          style={{
            background: "radial-gradient(circle, hsla(359, 55%, 42%, 0.14) 0%, transparent 70%)",
            top: "60%",
            right: "5%",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full animate-blob-3"
          style={{
            background: "radial-gradient(circle, hsla(359, 60%, 35%, 0.12) 0%, transparent 70%)",
            bottom: "5%",
            left: "40%",
          }}
        />
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {isMobile ? (
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AppSidebar onClose={() => setSidebarOpen(false)} />
        </div>
      ) : (
        <AppSidebar />
      )}

      <main className="flex-1 overflow-auto relative z-10">
        {/* Mobile header with hamburger */}
        {isMobile && (
          <div
            className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3"
            style={{
              background: 'hsla(359, 12%, 7%, 0.9)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid hsla(359, 30%, 18%, 0.3)',
            }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl transition-colors hover:bg-white/10"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <span className="text-sm font-extrabold tracking-tight text-foreground">
              TWELVE<span className="text-primary">FIT</span>
            </span>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
