import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  CalendarPlus, CreditCard, QrCode, MapPin, Dumbbell, Trophy, Quote, ChevronRight, Heart, Flame, TrendingUp,
} from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

const StatCounter = ({ end, label, icon: Icon, color }: { end: number; label: string; icon: React.ElementType; color?: string }) => {
  const count = useCountUp(end, 2200);
  return (
    <div className="text-center group">
      <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
        style={{ background: color ? `hsla(${color}, 0.15)` : "linear-gradient(135deg, hsla(359, 65%, 50%, 0.2), hsla(359, 55%, 42%, 0.1))", boxShadow: color ? `0 0 16px -4px hsla(${color}, 0.25)` : "0 0 16px -4px hsla(359, 65%, 50%, 0.25)", transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <Icon className="w-5 h-5" style={{ color: color ? `hsl(${color})` : undefined }} />
      </div>
      <p className="text-3xl font-extrabold tracking-tight">
        <span style={{ background: color ? `linear-gradient(135deg, hsl(${color}), hsl(359, 65%, 50%))` : "linear-gradient(135deg, hsl(359, 65%, 50%), hsl(359, 55%, 42%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>+{count}</span>
      </p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mt-1">{label}</p>
    </div>
  );
};

interface CheckinRow { id: string | number; branch: string; checked_in_at: string; }
interface ScheduleRow { id: string; name: string; trainer: string; scheduled_date: string; start_time?: string; }

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, user } = useAuth();

  const { data: checkins = [] } = useQuery<CheckinRow[]>({
    queryKey: ["recent-checkins", user?.id],
    queryFn: async () => {
      try { return await api.get<CheckinRow[]>("/checkins?limit=3"); } catch { return []; }
    },
    enabled: !!user,
  });

  const { data: schedules = [] } = useQuery<ScheduleRow[]>({
    queryKey: ["recent-schedules", user?.id],
    queryFn: async () => {
      try { return await api.get<ScheduleRow[]>("/schedules?limit=2"); } catch { return []; }
    },
    enabled: !!user,
  });

  const { data: totalCheckins = 0 } = useQuery<number>({
    queryKey: ["dashboard-total-checkins", user?.id],
    queryFn: async () => {
      try { return await api.get<number>("/checkins/count"); } catch { return 0; }
    },
    enabled: !!user,
  });

  const { data: scheduleCount = 0 } = useQuery<number>({
    queryKey: ["dashboard-schedule-count", user?.id],
    queryFn: async () => {
      try { return await api.get<number>("/schedules/count"); } catch { return 0; }
    },
    enabled: !!user,
  });

  const recentActivities = useMemo(() => {
    const activities: { icon: typeof Dumbbell; iconClass: string; title: string; subtitle: string }[] = [];
    schedules.forEach(s => {
      activities.push({
        icon: Dumbbell,
        iconClass: "icon-glow-red",
        title: `${s.name} – ${s.trainer}`,
        subtitle: `${new Date(s.scheduled_date).toLocaleDateString("vi-VN")}, ${s.start_time?.slice(0, 5)}`,
      });
    });
    checkins.slice(0, 1).forEach(c => {
      const d = new Date(c.checked_in_at);
      activities.push({
        icon: MapPin,
        iconClass: "icon-glow-amber",
        title: `Điểm danh tại ${c.branch}`,
        subtitle: `${d.toLocaleDateString("vi-VN")}, ${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`,
      });
    });
    return activities;
  }, [schedules, checkins]);

  const quickActions = [
    { icon: CalendarPlus, title: "Đặt lịch tập ngay", desc: "Chọn lớp, HLV phù hợp", gradient: true, path: "/booking" },
    { icon: CreditCard, title: "Đổi dịch vụ", desc: "Gia hạn hoặc mua thêm", gradient: false, path: "/packages" },
    { icon: QrCode, title: "Mã Check-in (QR)", desc: "Dùng để vào phòng tập", gradient: false, path: "/checkin" },
  ];

  const memberName = profile?.full_name || user?.fullName || user?.email || "Hội viên";
  const memberPackage = profile?.package || "Twelve Lite";
  const memberId = profile?.member_id || "";
  const memberExpiry = profile?.package_expiry ? new Date(profile.package_expiry).toLocaleDateString("vi-VN") : "";

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-slide-in-left">
        <div>
          <p className="text-muted-foreground text-sm font-medium animate-fade-down" style={{ animationDelay: '100ms' }}>Chào mừng quay trở lại,</p>
          <h1 className="text-2xl lg:text-3xl font-extrabold mt-1 tracking-tight animate-fade-down" style={{ animationDelay: '200ms' }}>{memberName} 👋</h1>
          <p className="stroke-text-subtle text-4xl lg:text-5xl font-black uppercase tracking-wider mt-1 select-none" aria-hidden="true">TWELVEFIT</p>
        </div>
        <div className="glass-card-hover px-5 py-3 flex items-center gap-3 animate-fade-down" style={{ animationDelay: '300ms' }}>
          <div className="w-11 h-11 icon-glow-red animate-float"><Trophy className="w-5 h-5 text-primary" /></div>
          <div className="text-right">
            <p className="text-sm font-bold">{memberPackage}</p>
            <p className="text-xs text-muted-foreground font-mono">ID: {memberId}</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 animate-scale-up" style={{ animationDelay: '250ms' }}>
        <div className="grid grid-cols-3 gap-6">
          <StatCounter end={140} label="Huấn luyện viên" icon={Dumbbell} color="359, 65%, 50%" />
          <StatCounter end={978} label="Hội viên đang tập" icon={Heart} color="340, 75%, 55%" />
          <StatCounter end={42} label="Chương trình tập" icon={Flame} color="24, 95%, 55%" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 animate-slide-in-left" style={{ animationDelay: "350ms" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold tracking-tight">Thông tin thẻ hội viên</h2>
              <span className="status-active animate-pulse-glow">ĐANG HOẠT ĐỘNG</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "GÓI HỘI VIÊN", value: memberPackage, emoji: "🏅", accent: "38, 92%, 50%" },
                { label: "NGÀY HẾT HẠN", value: memberExpiry, emoji: "📅", accent: "200, 70%, 50%" },
                { label: "TỔNG CHECK-IN", value: `${totalCheckins} lần`, emoji: "💪", accent: "152, 60%, 48%" },
                { label: "BUỔI ĐÃ ĐẶT", value: `${scheduleCount} buổi`, emoji: "🏋️", accent: "280, 60%, 55%" },
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-4 text-center space-y-2 card-lift cursor-default"
                  style={{ background: `hsla(${item.accent}, 0.08)`, border: `1px solid hsla(${item.accent}, 0.15)` }}>
                  <span className="text-2xl block transition-transform duration-500 hover:scale-125">{item.emoji}</span>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{item.label}</p>
                  <p className="text-sm font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 text-center animate-slide-in-left" style={{ animationDelay: "450ms" }}>
            <h2 className="text-lg font-bold mb-2 tracking-tight">Mã QR Điểm Danh</h2>
            <p className="text-sm text-muted-foreground mb-5">Đưa mã này trước scanner để check-in tại phòng tập</p>
            <div className="w-44 h-44 mx-auto rounded-2xl flex items-center justify-center mb-4 animate-glow-pulse qr-float"
              style={{ background: "linear-gradient(135deg, hsla(0,0%,95%,0.95), hsla(0,0%,90%,0.9))" }}>
              <div className="text-center">
                <QrCode className="w-24 h-24 mx-auto text-[hsl(220,20%,10%)]" />
                <p className="text-xs font-mono font-bold text-[hsl(220,20%,15%)] mt-1">TwelveFit • {memberId}</p>
              </div>
            </div>
            <button onClick={() => navigate("/checkin")} className="text-sm font-semibold text-primary hover:underline">
              Tạo mã QR tại trang Điểm danh →
            </button>
            <p className="text-sm font-semibold text-muted-foreground font-mono mt-1">ID: {memberId}</p>
          </div>

          <div className="glass-card p-6 animate-slide-in-left" style={{ animationDelay: "550ms" }}>
            <h2 className="text-lg font-bold mb-4 tracking-tight">Hoạt động gần đây</h2>
            <div className="space-y-3">
              {recentActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Chưa có hoạt động nào</p>
              ) : recentActivities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl activity-row cursor-default" style={{ background: "hsla(4, 18%, 12%, 0.45)" }}>
                  <div className={`w-10 h-10 ${a.iconClass}`}><a.icon className="w-4 h-4 text-current" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.subtitle}</p>
                  </div>
                  <Badge variant="outline" className="text-xs border-none" style={{ background: "hsla(152, 60%, 48%, 0.12)", color: "hsl(152, 60%, 55%)" }}>Thành công</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card-hover p-4 animate-slide-in-right relative overflow-hidden" style={{ animationDelay: '300ms' }}>
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full" style={{ background: 'radial-gradient(circle, hsla(340, 75%, 55%, 0.2), transparent)' }} />
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 animate-heartbeat" style={{ color: "hsl(340, 75%, 55%)" }} />
              <div>
                <p className="text-xs text-muted-foreground">Nhịp tim trung bình</p>
                <p className="text-2xl font-extrabold">116 <span className="text-xs font-normal text-muted-foreground">bpm</span></p>
              </div>
            </div>
          </div>

          <div className="glass-card-hover p-4 animate-slide-in-right relative overflow-hidden" style={{ animationDelay: '400ms' }}>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full" style={{ background: 'radial-gradient(circle, hsla(24, 95%, 55%, 0.2), transparent)' }} />
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 animate-flicker" style={{ color: "hsl(24, 95%, 55%)" }} />
              <div>
                <p className="text-xs text-muted-foreground">Calories đốt hôm nay</p>
                <p className="text-2xl font-extrabold">
                  <span style={{ background: "linear-gradient(135deg, hsl(24, 95%, 55%), hsl(359, 65%, 50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>480</span>
                  <span className="text-xs font-normal text-muted-foreground ml-1">kcal</span>
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card-hover p-4 animate-slide-in-right" style={{ animationDelay: '450ms' }}>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8" style={{ color: "hsl(152, 60%, 48%)" }} />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Tổng check-in</p>
                <p className="text-sm font-bold">{totalCheckins} lần điểm danh</p>
                <div className="w-full h-2 rounded-full mt-2 overflow-hidden" style={{ background: 'hsla(220, 15%, 18%, 0.8)' }}>
                  <div className="h-full rounded-full animate-progress-fill" style={{ width: `${Math.min(100, totalCheckins * 2)}%`, background: 'linear-gradient(90deg, hsl(152, 60%, 48%), hsl(200, 70%, 50%))' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 animate-slide-in-right" style={{ animationDelay: "500ms" }}>
            <h2 className="text-lg font-bold mb-4 tracking-tight">Thao tác nhanh</h2>
            <div className="space-y-3">
              {quickActions.map((action, i) => (
                <div key={i} className="quick-action-card" onClick={() => navigate(action.path)}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${action.gradient ? "btn-gradient" : ""}`}
                    style={!action.gradient ? { background: "hsla(220, 15%, 18%, 0.8)", border: "1px solid hsla(220, 15%, 25%, 0.3)" } : undefined}>
                    <action.icon className="w-5 h-5 text-white relative z-10" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5 animate-slide-in-right relative overflow-hidden" style={{ animationDelay: "600ms" }}>
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(280, 60%, 55%), transparent)" }} />
            <Quote className="w-8 h-8 text-primary mb-3 animate-float" />
            <p className="text-sm italic text-muted-foreground leading-relaxed">"Từng giọt mồ hôi là từng giọt sức khoẻ, từng bước đi là từng bước xây dựng cơ thể mơ ước."</p>
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-muted-foreground pt-4 pb-2 animate-fade-in" style={{ animationDelay: "700ms" }}>
        © 2023 TwelveFit Gym. All rights reserved. Hotline: 1900 2434
      </footer>
    </div>
  );
};

export default Dashboard;
