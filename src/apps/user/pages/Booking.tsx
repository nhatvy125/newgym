// src/pages/Booking.tsx — bản fix cho FE local
// - Dùng React Query + queryKey ["classes"] / ["my-bookings"]
// - Map đúng field BE: trainerName, startTime/endTime, spotsLeft, studio
// - Sau khi book thành công -> invalidate cả 2 query => trang Lịch tự refresh

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Clock, User, Calendar, AlertCircle, Dumbbell, Flame, Target, Zap, HeartPulse,
  TrendingUp, Users, Loader2, MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useCountUp } from "@/hooks/useCountUp";
import { classService, type GymClass } from "@/services/classService";
import { bookingService } from "@/services/bookingService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const classIcons = [Dumbbell, Target, HeartPulse, Flame, Zap];
const classAccents = [
  "200, 70%, 50%",
  "280, 60%, 55%",
  "340, 75%, 55%",
  "24, 95%, 55%",
  "152, 60%, 48%",
];

const StatCounter = ({
  end, label, icon: Icon, color,
}: { end: number; label: string; icon: React.ElementType; color?: string }) => {
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

const Booking = () => {
  const qc = useQueryClient();
  const [bookingId, setBookingId] = useState<number | string | null>(null);
  const [search, setSearch] = useState("");
  const [trainerFilter, setTrainerFilter] = useState("all");

  const { data: classes = [], isLoading } = useQuery<GymClass[]>({
    queryKey: ["classes"],
    queryFn: () => classService.getAll(),
  });

  // ALL HLV (loại trùng + loại rỗng)
  const trainers = Array.from(
    new Set(classes.map((c) => c.trainerName).filter(Boolean))
  );

  const filtered = classes.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(q) ||
      (c.trainerName || "").toLowerCase().includes(q);
    const matchTrainer = trainerFilter === "all" || c.trainerName === trainerFilter;
    return matchSearch && matchTrainer;
  });

  const handleBook = async (cls: GymClass) => {
    const slots = cls.spotsLeft ?? 0;
    if (slots <= 0) {
      toast.error("Lớp đã đầy! Vui lòng chọn lớp khác.");
      return;
    }
    setBookingId(cls.id);
    try {
      await bookingService.create(cls.id);
      toast.success(`Đăng ký lớp thành công: ${cls.name}`);
      // Đồng bộ cả 2 trang
      qc.invalidateQueries({ queryKey: ["classes"] });
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Đăng ký thất bại");
    } finally {
      setBookingId(null);
    }
  };

  const totalSlots = classes.reduce((sum, c) => sum + (c.spotsLeft ?? 0), 0);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="animate-slide-in-left">
        <p className="text-muted-foreground text-sm font-medium">Chọn lớp phù hợp với lịch trình</p>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight uppercase">
          <Dumbbell className="w-7 h-7 inline-block mr-2" style={{ color: "hsl(200, 70%, 50%)" }} />
          Danh sách lớp học nhóm
        </h1>
        <p className="stroke-text-subtle text-4xl lg:text-5xl font-black uppercase tracking-wider mt-1 select-none" aria-hidden="true">
          BOOKING
        </p>
      </div>

      <div className="glass-card p-6">
        <div className="grid grid-cols-3 gap-6">
          <StatCounter end={classes.length} label="Lớp học nhóm" icon={Dumbbell} color="200, 70%, 50%" />
          <StatCounter end={totalSlots} label="Slot trống" icon={TrendingUp} color="152, 60%, 48%" />
          <StatCounter end={trainers.length} label="Huấn luyện viên" icon={Users} color="280, 60%, 55%" />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm lớp hoặc HLV..."
            className="pl-9 rounded-xl bg-transparent border-border"
            style={{ background: "hsla(4, 15%, 10%, 0.5)", backdropFilter: "blur(12px)" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={trainerFilter} onValueChange={setTrainerFilter}>
          <SelectTrigger
            className="w-44 rounded-xl border-border"
            style={{ background: "hsla(4, 15%, 10%, 0.5)", backdropFilter: "blur(12px)" }}
          >
            <SelectValue placeholder="Huấn luyện viên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả HLV</SelectItem>
            {trainers.map((t) => (
              <SelectItem key={t} value={t}>HLV {t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">
          Không có lớp nào phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cls, i) => {
            const IconComp = classIcons[i % classIcons.length];
            const accent = classAccents[i % classAccents.length];
            const isBooking = bookingId === cls.id;
            const slots = cls.spotsLeft ?? 0;
            const startHM = (cls.startTime || "").slice(0, 5);
            const endHM = (cls.endTime || "").slice(0, 5);

            return (
              <div key={cls.id} className="glass-card-hover p-5 flex flex-col relative">
                <div
                  className="absolute top-0 left-5 right-5 h-[3px] rounded-b-full"
                  style={{
                    background: slots > 0
                      ? `linear-gradient(90deg, hsl(${accent}), hsl(359, 65%, 50%))`
                      : "hsla(0, 0%, 40%, 0.4)",
                  }}
                />

                <div className="flex items-center gap-3 mt-1 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 animate-float"
                    style={{
                      animationDelay: `${i * 150}ms`,
                      background: `hsla(${accent}, 0.15)`,
                      boxShadow: `0 0 12px -4px hsla(${accent}, 0.25)`,
                    }}
                  >
                    <IconComp className="w-5 h-5" style={{ color: `hsl(${accent})` }} />
                  </div>
                  <h3 className="font-extrabold text-base uppercase tracking-tight">
                    {cls.name}
                  </h3>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground flex-1">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" style={{ color: `hsl(${accent})` }} />
                    Lịch tập: {cls.schedule || new Date(cls.date).toLocaleDateString("vi-VN")}
                  </p>
                  <p className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" style={{ color: `hsl(${accent})` }} />
                    HLV: {cls.trainerName || "—"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" style={{ color: `hsl(${accent})` }} />
                    Giờ: {startHM && endHM ? `${startHM} - ${endHM}` : "—"}
                  </p>
                  {cls.studio && (
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" style={{ color: `hsl(${accent})` }} />
                      Phòng: {cls.studio}
                    </p>
                  )}
                </div>

                <div className="mt-3">
                  {slots > 0 ? (
                    <p className="text-sm font-bold" style={{ color: "hsl(152, 60%, 55%)" }}>
                      Trống: {slots}/{cls.maxCapacity} slot
                    </p>
                  ) : (
                    <p className="text-sm font-bold flex items-center gap-1" style={{ color: "hsl(0, 60%, 50%)" }}>
                      <AlertCircle className="w-3.5 h-3.5" /> HẾT SLOT
                    </p>
                  )}
                </div>

                <Button
                  size="sm"
                  onClick={() => handleBook(cls)}
                  disabled={slots <= 0 || isBooking}
                  className={`w-full rounded-xl mt-4 font-bold uppercase tracking-wide text-xs ${slots <= 0 ? "opacity-50" : "btn-gradient"}`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isBooking && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {slots <= 0 ? "HẾT CHỖ" : isBooking ? "ĐANG ĐĂNG KÝ..." : "ĐĂNG KÝ LỚP"}
                  </span>
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <footer className="text-center text-xs text-muted-foreground pt-4 pb-2">
        © 2026 TwelveFit Gym. All rights reserved.
      </footer>
    </div>
  );
};

export default Booking;
