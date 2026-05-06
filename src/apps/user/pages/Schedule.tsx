// src/pages/Schedule.tsx — bản fix cho FE local
// Dùng React Query với queryKey ["my-bookings"] => khi Booking.tsx invalidate sẽ tự refresh.

import {
  Calendar, Clock, User, Dumbbell, CheckCircle, Timer, CalendarDays, TrendingUp, Trash2, Loader2,
} from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { bookingService, type BookingResponse } from "@/services/bookingService";

const statusStyles: Record<string, { bg: string; color: string; icon: typeof CheckCircle; label: string }> = {
  COMPLETED: { bg: "hsla(152, 60%, 48%, 0.12)", color: "hsl(152, 60%, 55%)", icon: CheckCircle, label: "Hoàn thành" },
  BOOKED:    { bg: "hsla(38, 92%, 50%, 0.12)",  color: "hsl(38, 92%, 60%)",  icon: Timer,        label: "Sắp tới" },
  CANCELLED: { bg: "hsla(0, 60%, 50%, 0.12)",   color: "hsl(0, 60%, 60%)",   icon: CalendarDays, label: "Đã huỷ" },
};

const StatCounter = ({
  end, label, icon: Icon, color,
}: { end: number; label: string; icon: React.ElementType; color?: string }) => {
  const count = useCountUp(end, 2000);
  return (
    <div className="text-center group">
      <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center"
        style={{ background: color ? `hsla(${color}, 0.15)` : undefined, boxShadow: color ? `0 0 16px -4px hsla(${color}, 0.25)` : undefined }}>
        <Icon className="w-5 h-5" style={{ color: color ? `hsl(${color})` : undefined }} />
      </div>
      <p className="text-3xl font-extrabold tracking-tight">
        <span style={{
          background: color ? `linear-gradient(135deg, hsl(${color}), hsl(359, 65%, 50%))` : undefined,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>{count}</span>
      </p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mt-1">{label}</p>
    </div>
  );
};

const Schedule = () => {
  const qc = useQueryClient();
  const [deleting, setDeleting] = useState<number | null>(null);
  const [cancelTarget, setCancelTarget] = useState<{ id: number; name: string } | null>(null);

  const { data: bookings = [] } = useQuery<BookingResponse[]>({
    queryKey: ["my-bookings"],
    queryFn: () => bookingService.getMyBookings(),
  });

  const now = new Date();
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate() + 6);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const weeklyCount = useMemo(
    () => bookings.filter((s) => { const d = new Date(s.date); return d >= startOfWeek && d <= endOfWeek; }).length,
    [bookings]
  );
  const monthlyCount = useMemo(
    () => bookings.filter((s) => { const d = new Date(s.date); return d >= startOfMonth && d <= endOfMonth; }).length,
    [bookings]
  );
  const completedCount = useMemo(
    () => bookings.filter((s) => s.status === "COMPLETED").length,
    [bookings]
  );

  const handleCancel = async () => {
    if (!cancelTarget) return;
    const { id, name } = cancelTarget;
    setDeleting(id);
    setCancelTarget(null);
    try {
      await bookingService.cancel(id);
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
      qc.invalidateQueries({ queryKey: ["classes"] });
      toast.success(`Đã hủy lớp: ${name}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Hủy thất bại");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-muted-foreground text-sm font-medium">Theo dõi lịch tập của bạn</p>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
          <Calendar className="w-7 h-7 inline-block mr-2" style={{ color: "hsl(280, 60%, 55%)" }} />
          Lịch của tôi
        </h1>
      </div>

      <div className="glass-card p-6">
        <div className="grid grid-cols-3 gap-6">
          <StatCounter end={weeklyCount} label="Buổi tuần này" icon={Dumbbell} color="359, 65%, 50%" />
          <StatCounter end={monthlyCount} label="Buổi tháng" icon={TrendingUp} color="280, 60%, 55%" />
          <StatCounter end={completedCount} label="Hoàn thành" icon={CheckCircle} color="152, 60%, 48%" />
        </div>
      </div>

      <div className="space-y-3">
        {bookings.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Bạn chưa có lịch tập nào. Hãy đặt lịch tại trang Đặt lịch tập!</p>
          </div>
        ) : bookings.map((s) => {
          const style = statusStyles[s.status || "BOOKED"] || statusStyles.BOOKED;
          const StatusIcon = style.icon;
          const accent = "38, 92%, 50%";
          return (
            <div key={s.id} className="glass-card-hover p-5 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `hsla(${accent}, 0.15)`, boxShadow: `0 0 12px -4px hsla(${accent}, 0.25)` }}>
                <Dumbbell className="w-5 h-5" style={{ color: `hsl(${accent})` }} />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-sm">{s.className}</h3>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(s.date).toLocaleDateString("vi-VN")}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {s.startTime?.slice(0,5)} - {s.endTime?.slice(0,5)}</span>
                  <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {s.trainerName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
                  style={{ background: style.bg, color: style.color }}>
                  <StatusIcon className="w-3 h-3" /> {style.label}
                </span>
                {s.status !== "COMPLETED" && s.status !== "CANCELLED" && (
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 rounded-lg hover:bg-destructive/15 hover:text-destructive"
                    onClick={() => setCancelTarget({ id: s.id, name: s.className })}
                    disabled={deleting === s.id}
                    title="Hủy lớp"
                  >
                    {deleting === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AlertDialog open={!!cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <AlertDialogContent className="glass-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-extrabold">Xác nhận hủy lớp</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn hủy lớp <span className="font-bold text-foreground">{cancelTarget?.name}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Giữ lại</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Hủy lớp
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Schedule;
