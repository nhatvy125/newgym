import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CreditCard, CalendarPlus, ScanLine, Calendar, User, LogOut, Dumbbell, X, Users, MapPin,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const baseNavItems = [
  { to: "/dashboard", label: "Tổng quan", icon: LayoutDashboard, isPrimary: false },
  { to: "/packages", label: "Gói hội viên", icon: CreditCard, isPrimary: true },
  { to: "/booking", label: "Đặt lịch tập", icon: CalendarPlus, isPrimary: false },
  { to: "/checkin", label: "Điểm danh", icon: ScanLine, isPrimary: false },
  { to: "/schedule", label: "Lịch của tôi", icon: Calendar, isPrimary: false },
  { to: "/profile", label: "Trang cá nhân", icon: User, isPrimary: false },
];

const adminNavItems = [
  { to: "/admin/members", label: "Quản lý hội viên", icon: Users, isPrimary: false },
  { to: "/admin/branches", label: "Quản lý chi nhánh", icon: MapPin, isPrimary: false },
];

interface AppSidebarProps {
  onClose?: () => void;
}

const AppSidebar = ({ onClose }: AppSidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navItems = user?.role === 'ADMIN' ? [...baseNavItems, ...adminNavItems] : baseNavItems;

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất");
    navigate("/");
  };

  return (
    <aside
      className="w-64 min-h-screen flex flex-col p-4 relative z-10"
      style={{
        background: 'hsla(359, 12%, 7%, 0.88)',
        backdropFilter: 'blur(24px) saturate(1.3)',
        borderRight: '1px solid hsla(359, 30%, 18%, 0.3)',
      }}
    >
      <div className="flex items-center justify-between px-3 py-4 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center btn-gradient">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-foreground">
            TWELVE<span className="text-primary">FIT</span>
          </span>
        </div>
        {isMobile && onClose && (
          <button onClick={onClose} className="p-2 rounded-xl transition-colors hover:bg-white/10">
            <X className="w-5 h-5 text-foreground" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          
          if (item.isPrimary) {
            // Gói hội viên - styled as a primary red button
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={isMobile ? onClose : undefined}
                className="group/nav flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 bg-red-600 text-white hover:bg-red-700 shadow-lg active:scale-95 w-full"
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </NavLink>
            );
          }

          // Regular menu items
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={isMobile ? onClose : undefined}
              className={`group/nav flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "btn-gradient shadow-lg text-white scale-[1.02]"
                  : "text-[hsl(220,10%,60%)] hover:text-foreground hover:bg-[hsla(220,15%,18%,0.5)] hover:translate-x-1 hover:scale-[1.01] hover:shadow-[0_4px_16px_-4px_hsla(359,65%,50%,0.2)] active:scale-95"
              }`}
              style={isActive ? { boxShadow: '0 4px 20px -4px hsla(4, 80%, 56%, 0.35)' } : undefined}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mt-4 transition-all duration-200 active:scale-[0.97]"
        style={{
          background: 'hsla(359, 65%, 50%, 0.1)',
          border: '1px solid hsla(359, 65%, 50%, 0.2)',
          color: 'hsl(359, 65%, 60%)',
        }}
      >
        <LogOut className="w-[18px] h-[18px]" />
        Đăng xuất
      </button>
    </aside>
  );
};

export default AppSidebar;
