import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, ArrowRight, Dumbbell, Crown, GraduationCap, Award, Sparkles, Users, Zap, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCountUp } from "@/hooks/useCountUp";
import { api } from "@/api/api";
import { useAuth } from "@/hooks/useAuth";

const packages = [
  { id: 1, name: "TWELVE LITE", duration: "1 tháng", price: "500.000",
    description: "Gói cơ bản dành cho người mới bắt đầu. Tự do tập gym không giới hạn thời gian trong ngày, sử dụng toàn bộ thiết bị tại phòng tập.",
    popular: false, label: "", icon: Dumbbell, accent: "200, 70%, 50%" },
  { id: 2, name: "TWELVE STUDENT", duration: "3 tháng", price: "1.200.000",
    description: "Ưu đãi dành cho học sinh, sinh viên. Tập gym không giới hạn, được hướng dẫn lịch tập cơ bản và tham gia 4 buổi group training miễn phí.",
    popular: false, label: "ƯU ĐÃI", icon: GraduationCap, accent: "152, 60%, 48%" },
  { id: 3, name: "TWELVE ELITE", duration: "6 tháng", price: "2.400.000",
    description: "Gói phổ biến nhất. Tập gym không giới hạn, 12 buổi group training, 3 buổi PT cá nhân, tư vấn dinh dưỡng cơ bản và ưu tiên đặt lịch.",
    popular: true, label: "PHỔ BIẾN", icon: Award, accent: "359, 65%, 50%" },
  { id: 4, name: "TWELVE PLATINUM", duration: "12 tháng", price: "4.200.000",
    description: "Gói cao cấp nhất. Full quyền lợi, PT riêng hàng tuần, group training không giới hạn, tư vấn dinh dưỡng chuyên sâu, locker riêng và khăn tập miễn phí.",
    popular: false, label: "", icon: Crown, accent: "38, 92%, 50%" },
];

const StatCounter = ({ end, label, icon: Icon, color }: { end: number; label: string; icon: React.ElementType; color?: string }) => {
  const count = useCountUp(end, 2000);
  return (
    <div className="text-center group">
      <div
        className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
        style={{
          background: color ? `hsla(${color}, 0.15)` : undefined,
          boxShadow: color ? `0 0 16px -4px hsla(${color}, 0.25)` : undefined,
        }}
      >
        <Icon className="w-5 h-5" style={{ color: color ? `hsl(${color})` : undefined }} />
      </div>
      <p className="text-3xl font-extrabold tracking-tight">
        <span style={{
          background: color ? `linear-gradient(135deg, hsl(${color}), hsl(359, 65%, 50%))` : undefined,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>{count}</span>
      </p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mt-1">{label}</p>
    </div>
  );
};

const Packages = () => {
  const [search, setSearch] = useState("");
  const [registering, setRegistering] = useState<number | null>(null);
  const { user, refreshProfile } = useAuth();

  const filtered = packages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRegister = async (pkg: (typeof packages)[0]) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập trước!");
      return;
    }
    setRegistering(pkg.id);
    try {
      const expiry = new Date();
      const months = pkg.id === 1 ? 1 : pkg.id === 2 ? 3 : pkg.id === 3 ? 6 : 12;
      expiry.setMonth(expiry.getMonth() + months);
      const expiryStr = expiry.toISOString().split("T")[0];

      await api.put("/users/me", {
        package: pkg.name,
        package_expiry: expiryStr,
        packageExpiry: expiryStr,
      });

      await refreshProfile();
      toast.success(`Đăng ký thành công gói ${pkg.name}!`);
    } catch (err: any) {
      toast.error("Đăng ký thất bại: " + err.message);
    } finally {
      setRegistering(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="animate-slide-in-left">
        <p className="text-muted-foreground text-sm font-medium animate-fade-down" style={{ animationDelay: '100ms' }}>
          Khám phá các gói tập phù hợp
        </p>
         <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight uppercase animate-fade-down flex items-center gap-2" style={{ animationDelay: '200ms' }}>
           <CreditCard className="w-7 h-7" style={{ color: "hsl(var(--primary))" }} />
           Các gói hội viên TwelveFit
         </h1>
        <p className="stroke-text-subtle text-4xl lg:text-5xl font-black uppercase tracking-wider mt-1 select-none" aria-hidden="true">
          PACKAGES
        </p>
      </div>

      <div className="glass-card p-6 animate-scale-up" style={{ animationDelay: '250ms' }}>
        <div className="grid grid-cols-3 gap-6">
          <StatCounter end={4} label="Gói tập luyện" icon={Sparkles} color="280, 60%, 55%" />
          <StatCounter end={978} label="Hội viên tin dùng" icon={Users} color="359, 65%, 50%" />
          <StatCounter end={98} label="% Hài lòng" icon={Zap} color="38, 92%, 50%" />
        </div>
      </div>

      <div className="relative max-w-sm animate-slide-in-left" style={{ animationDelay: "300ms" }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm gói tập..."
          className="pl-9 bg-transparent border-border rounded-xl"
          style={{
            background: 'hsla(4, 15%, 10%, 0.5)',
            backdropFilter: 'blur(12px)',
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((pkg, i) => {
          const IconComp = pkg.icon;
          return (
            <div
              key={pkg.id}
              className="glass-card-hover p-6 relative flex flex-col animate-slide-in-left"
              style={{ animationDelay: `${350 + i * 100}ms` }}
            >
              <div
                className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full"
                style={{
                  background: `linear-gradient(90deg, hsl(${pkg.accent}), hsl(359, 65%, 50%))`,
                }}
              />

              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 mt-1 animate-float"
                style={{
                  animationDelay: `${i * 200}ms`,
                  background: `hsla(${pkg.accent}, 0.15)`,
                  boxShadow: `0 0 16px -4px hsla(${pkg.accent}, 0.25)`,
                }}
              >
                <IconComp className="w-5 h-5" style={{ color: `hsl(${pkg.accent})` }} />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: `hsl(${pkg.accent})` }}>
                  <Clock className="w-3 h-3" /> {pkg.duration}
                </span>
                {pkg.label && (
                  <span
                    className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full animate-pulse-glow"
                    style={{
                      background: `hsla(${pkg.accent}, 0.15)`,
                      color: `hsl(${pkg.accent})`,
                    }}
                  >
                    {pkg.label}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-extrabold tracking-tight leading-tight">
                {pkg.name}
              </h3>

              <div className="mt-3 mb-1">
                <span className="text-2xl font-extrabold tracking-tight" style={{
                  background: `linear-gradient(135deg, hsl(${pkg.accent}), hsl(359, 65%, 50%))`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>{pkg.price}</span>
                <span className="text-sm text-muted-foreground ml-1">VNĐ</span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mt-2 flex-1">
                {pkg.description}
              </p>

              <Button
                size="sm"
                onClick={() => handleRegister(pkg)}
                disabled={registering === pkg.id}
                className="w-full rounded-xl btn-gradient mt-5"
              >
                <span className="relative z-10 flex items-center gap-1 font-bold uppercase tracking-wide text-xs">
                  {registering === pkg.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Đăng ký <ArrowRight className="w-3.5 h-3.5" /></>}
                </span>
              </Button>
            </div>
          );
        })}
      </div>

      <footer className="text-center text-xs text-muted-foreground pt-4 pb-2 animate-fade-in" style={{ animationDelay: "800ms" }}>
        © 2023 TwelveFit Gym. All rights reserved.
      </footer>
    </div>
  );
};

export default Packages;
