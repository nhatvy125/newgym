import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { QrCode, CheckCircle, MapPin, Clock, Sparkles, ShieldCheck, UserCheck, ScanLine, TrendingUp, Calendar, BadgeCheck, Fingerprint } from "lucide-react";
import { toast } from "sonner";
import { useCountUp } from "@/hooks/useCountUp";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

const StatCounter = ({ end, label, icon: Icon, color }: { end: number; label: string; icon: React.ElementType; color?: string }) => {
  const count = useCountUp(end, 2000);
  return (
    <div className="text-center group">
      <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
        style={{ background: color ? `hsla(${color}, 0.15)` : undefined, boxShadow: color ? `0 0 16px -4px hsla(${color}, 0.25)` : undefined }}>
        <Icon className="w-5 h-5" style={{ color: color ? `hsl(${color})` : undefined }} />
      </div>
      <p className="text-3xl font-extrabold tracking-tight">
        <span style={{ background: color ? `linear-gradient(135deg, hsl(${color}), hsl(359, 65%, 50%))` : undefined, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{count}</span>
      </p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mt-1">{label}</p>
    </div>
  );
};

interface CheckinRow { id: string | number; branch: string; checked_in_at: string; }

const Checkin = () => {
  const { profile, user } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [qrTimestamp, setQrTimestamp] = useState<string>("");
  const [showCheckinResult, setShowCheckinResult] = useState(false);

  const { data: checkins = [], refetch: refetchCheckins } = useQuery<CheckinRow[]>({
    queryKey: ["checkins", user?.id],
    queryFn: async () => {
      try { return await api.get<CheckinRow[]>("/checkins?limit=10"); } catch { return []; }
    },
    enabled: !!user,
  });

  const { data: totalCheckins = 0 } = useQuery<number>({
    queryKey: ["total-checkins", user?.id],
    queryFn: async () => {
      try { return await api.get<number>("/checkins/count"); } catch { return 0; }
    },
    enabled: !!user,
  });

  const streakDays = useMemo(() => {
    if (checkins.length === 0) return 0;
    let streak = 1;
    const dates = checkins.map(c => new Date(c.checked_in_at).toDateString());
    const uniqueDates = [...new Set(dates)];
    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = new Date(uniqueDates[i - 1]).getTime() - new Date(uniqueDates[i]).getTime();
      if (diff <= 86400000 * 1.5) streak++;
      else break;
    }
    return streak;
  }, [checkins]);

  const memberData = {
    action: "CHECK_IN",
    memberId: profile?.member_id || "",
    memberName: profile?.full_name || "",
    membership: "Đang hoạt động",
    package: profile?.package || "Twelve Lite",
    branch: profile?.branch || "Chi nhánh Quận 1",
    loyaltyStreak: streakDays,
  };

  const qrData = useMemo(() => {
    if (!showQR) return "";
    const now = qrTimestamp ? new Date(parseInt(qrTimestamp)) : new Date();
    return JSON.stringify({
      ...memberData,
      timestamp: now.toISOString(),
      checkinTime: now.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    });
  }, [showQR, qrTimestamp, memberData]);

  const handleGenerate = async () => {
    if (!user) return;
    const ts = Date.now().toString();
    setQrTimestamp(ts);
    setShowQR(true);
    setShowCheckinResult(false);

    try {
      await api.post("/checkins", { branch: profile?.branch || "Chi nhánh Quận 1" });
      refetchCheckins();
      toast.success(`Check-in thành công lúc ${new Date().toLocaleTimeString("vi-VN")}!`);
    } catch (err) {
      console.error(err);
      toast.error("Check-in thất bại");
    }
  };

  const handleSimulateScan = () => {
    setShowCheckinResult(true);
    toast.success("Quét mã QR thành công!");
  };

  const branchCount = useMemo(() => new Set(checkins.map(c => c.branch)).size || 1, [checkins]);

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="animate-slide-in-left">
        <p className="text-muted-foreground text-sm font-medium animate-fade-down" style={{ animationDelay: '100ms' }}>Điểm danh nhanh chóng với mã QR</p>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight animate-fade-down" style={{ animationDelay: '200ms' }}>
          <ScanLine className="w-7 h-7 inline-block mr-2" style={{ color: "hsl(152, 60%, 48%)" }} />
          QR Check-in
        </h1>
        <p className="stroke-text-subtle text-4xl lg:text-5xl font-black uppercase tracking-wider mt-1 select-none" aria-hidden="true">CHECK-IN</p>
      </div>

      <div className="glass-card p-6 animate-scale-up" style={{ animationDelay: '250ms' }}>
        <div className="grid grid-cols-3 gap-6">
          <StatCounter end={totalCheckins} label="Lần check-in" icon={ScanLine} color="152, 60%, 48%" />
          <StatCounter end={streakDays} label="Chuỗi ngày" icon={TrendingUp} color="200, 70%, 50%" />
          <StatCounter end={branchCount} label="Chi nhánh" icon={MapPin} color="359, 65%, 50%" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 text-center space-y-5 animate-slide-in-left" style={{ animationDelay: "350ms" }}>
          <h2 className="font-bold text-lg tracking-tight flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5 animate-float" style={{ color: "hsl(152, 60%, 48%)" }} /> Mã QR của bạn
          </h2>

          <div className="rounded-xl p-4 text-left space-y-2.5" style={{ background: "hsla(152, 18%, 12%, 0.35)", border: "1px solid hsla(152, 40%, 22%, 0.25)" }}>
            <p className="text-sm flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5" style={{ color: "hsl(152, 60%, 48%)" }} />
              <span className="text-muted-foreground">Họ tên:</span> <span className="font-semibold">{profile?.full_name}</span>
            </p>
            <p className="text-sm flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: "hsl(152, 60%, 48%)" }} />
              <span className="text-muted-foreground">Trạng thái:</span> <span className="status-active">Đang hoạt động</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">ID:</span> <span className="font-mono font-bold">{profile?.member_id}</span>
            </p>
          </div>

          {showQR ? (
            <div className="space-y-3">
              <div className="w-48 h-48 mx-auto rounded-2xl flex items-center justify-center qr-float animate-glow-pulse p-3"
                style={{ background: "linear-gradient(135deg, hsla(0,0%,98%,0.97), hsla(0,0%,93%,0.95))" }}>
                <QRCodeSVG value={qrData} size={160} level="M" bgColor="transparent" fgColor="#1a1a2e" />
              </div>
              <p className="text-xs text-muted-foreground">Quét mã QR để xem thông tin check-in thời gian thực</p>
              <p className="text-[10px] font-mono" style={{ color: "hsl(152, 60%, 48%)" }}>
                Tạo lúc: {new Date(parseInt(qrTimestamp)).toLocaleTimeString("vi-VN")}
              </p>
              <Button variant="outline" size="sm" onClick={handleSimulateScan} className="rounded-xl border-border hover:border-[hsl(152,60%,48%)]/30">
                <Fingerprint className="w-4 h-4 mr-1" style={{ color: "hsl(152, 60%, 48%)" }} /> Quét mã QR
              </Button>
            </div>
          ) : (
            <div className="py-8">
              <QrCode className="w-16 h-16 mx-auto text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground">Nhấn nút bên dưới để tạo mã QR</p>
            </div>
          )}

          <Button onClick={handleGenerate} className="w-full rounded-xl btn-gradient">
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> {showQR ? "Tạo lại mã QR" : "Tạo mã QR"}
            </span>
          </Button>
        </div>

        <div className="space-y-6">
          {showCheckinResult && (
            <div className="rounded-2xl p-6 space-y-4 animate-scale-up text-center relative"
              style={{ background: "hsla(210, 30%, 8%, 0.75)", backdropFilter: "blur(32px) saturate(1.6)", border: "1px solid hsla(200, 50%, 30%, 0.3)", boxShadow: "0 0 40px -8px hsla(200, 70%, 50%, 0.2), 0 12px 40px -12px hsla(0,0%,0%,0.6)" }}>
              <button onClick={() => setShowCheckinResult(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ background: "hsla(210, 20%, 18%, 0.6)", border: "1px solid hsla(210, 20%, 25%, 0.3)" }}>✕</button>
              <div className="flex justify-center pt-2">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "hsla(200, 70%, 50%, 0.15)", border: "2px solid hsla(200, 70%, 50%, 0.4)", boxShadow: "0 0 24px -4px hsla(200, 70%, 50%, 0.3)" }}>
                  <CheckCircle className="w-7 h-7" style={{ color: "hsl(200, 70%, 55%)" }} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg flex items-center justify-center gap-2">
                  <BadgeCheck className="w-5 h-5" style={{ color: "hsl(200, 70%, 55%)" }} /> Check-in thành công
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Chào mừng đến TwelveFit, {profile?.full_name?.split(" ").pop()}</p>
              </div>
              <div className="rounded-xl p-4 space-y-2.5 text-left mx-auto max-w-[300px]" style={{ background: "hsla(210, 25%, 12%, 0.7)", border: "1px solid hsla(200, 40%, 25%, 0.3)" }}>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Họ tên</span><span className="font-semibold">{memberData.memberName}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Mã hội viên</span><span className="font-mono font-semibold">{memberData.memberId}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Gói hội viên</span><span className="font-semibold" style={{ color: "hsl(200, 70%, 55%)" }}>{memberData.package}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Chi nhánh</span><span className="font-semibold">{memberData.branch}</span></div>
              </div>
              <div className="grid grid-cols-3 gap-3 max-w-[340px] mx-auto">
                <div className="rounded-xl p-3 text-center" style={{ background: "hsla(210, 25%, 12%, 0.7)", border: "1px solid hsla(200, 40%, 25%, 0.25)" }}>
                  <Calendar className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: "hsl(200, 70%, 55%)" }} />
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Ngày</p>
                  <p className="text-sm font-bold mt-1">{qrTimestamp ? new Date(parseInt(qrTimestamp)).toLocaleDateString("vi-VN") : "--/--/----"}</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: "hsla(210, 25%, 12%, 0.7)", border: "1px solid hsla(200, 40%, 25%, 0.25)" }}>
                  <Clock className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: "hsl(200, 70%, 55%)" }} />
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Giờ vào</p>
                  <p className="text-sm font-bold mt-1">{qrTimestamp ? new Date(parseInt(qrTimestamp)).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "--:--"}</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: "hsla(210, 25%, 12%, 0.7)", border: "1px solid hsla(200, 40%, 25%, 0.25)" }}>
                  <TrendingUp className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: "hsl(200, 70%, 55%)" }} />
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Chuỗi ngày</p>
                  <p className="text-sm font-bold mt-1">{streakDays} 🔥</p>
                </div>
              </div>
              <button onClick={() => window.location.href = "/dashboard"} className="w-full max-w-[300px] mx-auto py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, hsl(200, 70%, 50%), hsl(210, 80%, 45%))", boxShadow: "0 0 20px -4px hsla(200, 70%, 50%, 0.4)", color: "white" }}>
                Đi đến Dashboard →
              </button>
            </div>
          )}

          <div className="glass-card p-6 animate-slide-in-right" style={{ animationDelay: "400ms" }}>
            <h2 className="font-bold text-lg mb-4 tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 animate-float" style={{ color: "hsl(200, 70%, 50%)" }} /> Lịch sử Check-in
            </h2>
            <div className="space-y-3">
              {checkins.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Chưa có lịch sử check-in</p>
              ) : checkins.slice(0, 5).map((h) => {
                const date = new Date(h.checked_in_at);
                return (
                  <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl activity-row cursor-default" style={{ background: "hsla(200, 18%, 12%, 0.35)" }}>
                    <div className="w-9 h-9 icon-glow-green shrink-0"><CheckCircle className="w-4 h-4 text-success" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-3 h-3" /> {date.toLocaleDateString("vi-VN")} - {date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {h.branch}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 text-sm text-muted-foreground animate-fade-in flex items-center gap-2" style={{ animationDelay: "600ms" }}>
        💡 Lưu ý: Mã QR có hiệu lực trong 5 phút. Vui lòng tạo mã mới nếu hết hạn.
      </div>
    </div>
  );
};

export default Checkin;
