import { useState, useRef } from "react";
import { Mail, Phone, MapPin, CreditCard, Edit3, Shield, User, Trophy, Dumbbell, TrendingUp, Save, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCountUp } from "@/hooks/useCountUp";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

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

const Profile = () => {
  const { profile, user, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ full_name: "", email: "", phone: "", address: "" });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: checkinCount = 0 } = useQuery<number>({
    queryKey: ["checkin-count", user?.id],
    queryFn: async () => {
      try { return await api.get<number>("/checkins/count"); } catch { return 0; }
    },
    enabled: !!user,
  });

  const { data: monthsActive = 0 } = useQuery<number>({
    queryKey: ["months-active", profile?.created_at],
    queryFn: () => {
      if (!profile?.created_at) return 0;
      const created = new Date(profile.created_at);
      const now = new Date();
      return Math.max(1, Math.ceil((now.getTime() - created.getTime()) / (30 * 24 * 60 * 60 * 1000)));
    },
    enabled: !!profile,
  });

  if (!profile) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Ảnh không được vượt quá 5MB"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Vui lòng chọn file ảnh"); return; }

    setUploading(true);
    try {
      // Upload sang Java backend bằng multipart/form-data
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");
      await api.postForm<void>("/users/me/avatar", formData);
      await refreshProfile();
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = () => {
    setEditData({
      full_name: profile.full_name,
      email: profile.email,
      phone: profile.phone || "",
      address: profile.address || "",
    });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await api.put("/users/me", {
        fullName: editData.full_name,
        full_name: editData.full_name,
        phone: editData.phone,
        address: editData.address,
      });
      await refreshProfile();
      setEditing(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi cập nhật thông tin");
    }
  };

  const handleCancel = () => setEditing(false);

  const profileItems = [
    { icon: Mail, label: "Email", key: "email" as const, accent: "200, 70%, 50%", editable: false },
    { icon: Phone, label: "Số điện thoại", key: "phone" as const, accent: "152, 60%, 48%", editable: true },
    { icon: MapPin, label: "Địa chỉ", key: "address" as const, accent: "38, 92%, 50%", editable: true },
    { icon: CreditCard, label: "Gói hiện tại", key: "package" as const, accent: "280, 60%, 55%", editable: false,
      suffix: profile.package_expiry ? ` - Hết hạn ${new Date(profile.package_expiry).toLocaleDateString("vi-VN")}` : "" },
  ];

  const attendanceRate = checkinCount > 0 ? Math.min(100, Math.round((checkinCount / (monthsActive * 20)) * 100)) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div className="animate-slide-in-left">
        <p className="text-muted-foreground text-sm font-medium animate-fade-down" style={{ animationDelay: '100ms' }}>Quản lý thông tin cá nhân</p>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight animate-fade-down" style={{ animationDelay: '200ms' }}>
          <IdCard className="w-7 h-7 inline-block mr-2" style={{ color: "hsl(38, 92%, 50%)" }} />
          Trang cá nhân
        </h1>
        <p className="stroke-text-subtle text-4xl lg:text-5xl font-black uppercase tracking-wider mt-1 select-none" aria-hidden="true">PROFILE</p>
      </div>

      <div className="glass-card p-6 animate-scale-up" style={{ animationDelay: '250ms' }}>
        <div className="grid grid-cols-3 gap-6">
          <StatCounter end={checkinCount} label="Buổi tập" icon={Dumbbell} color="359, 65%, 50%" />
          <StatCounter end={monthsActive} label="Tháng thành viên" icon={Trophy} color="38, 92%, 50%" />
          <StatCounter end={attendanceRate} label="% Chuyên cần" icon={TrendingUp} color="152, 60%, 48%" />
        </div>
      </div>

      <div className="glass-card p-6 animate-slide-in-left" style={{ animationDelay: "350ms" }}>
        <div className="flex items-center gap-4 mb-6">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative w-16 h-16 rounded-2xl overflow-hidden group shrink-0"
            title="Thay đổi ảnh đại diện"
            disabled={uploading}
          >
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-extrabold text-white btn-gradient">
                <span className="relative z-10">
                  {profile.full_name.split(" ").slice(-2).map(w => w[0]).join("")}
                </span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "hsla(0, 0%, 0%, 0.55)" }}>
              <Camera className="w-5 h-5 text-white" />
            </div>
          </button>
          <div>
            {editing ? (
              <Input
                value={editData.full_name}
                onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                className="text-xl font-extrabold bg-transparent border-border rounded-xl"
              />
            ) : (
              <h2 className="text-xl font-extrabold tracking-tight">{profile.full_name}</h2>
            )}
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Shield className="w-3.5 h-3.5 text-primary/70" />
              {profile.package} • <span className="font-mono">{profile.member_id}</span>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {profileItems.map((item, i) => {
            const value = item.key === "package" ? (profile.package || "Twelve Lite") :
              item.key === "email" ? profile.email :
              item.key === "phone" ? (profile.phone || "") :
              (profile.address || "");
            return (
              <div
                key={i}
                className="flex items-center gap-3 p-3.5 rounded-xl activity-row cursor-default"
                style={{
                  background: `hsla(${item.accent}, 0.06)`,
                  border: `1px solid hsla(${item.accent}, 0.12)`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `hsla(${item.accent}, 0.15)`, boxShadow: `0 0 12px -4px hsla(${item.accent}, 0.2)` }}
                >
                  <item.icon className="w-4 h-4" style={{ color: `hsl(${item.accent})` }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  {editing && item.editable ? (
                    <Input
                      value={editData[item.key as keyof typeof editData] || ""}
                      onChange={(e) => setEditData({ ...editData, [item.key]: e.target.value })}
                      className="text-sm font-semibold bg-transparent border-border rounded-lg mt-1 h-8"
                    />
                  ) : (
                    <p className="text-sm font-semibold">{value}{item.suffix || ""}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {editing ? (
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} className="flex-1 rounded-xl btn-gradient">
              <span className="relative z-10 flex items-center gap-2"><Save className="w-4 h-4" /> Lưu thông tin</span>
            </Button>
            <Button onClick={handleCancel} variant="outline" className="rounded-xl border-border">
              <X className="w-4 h-4 mr-1" /> Hủy
            </Button>
          </div>
        ) : (
          <Button onClick={handleEdit} variant="outline" className="mt-6 w-full rounded-xl border-border hover:border-primary/30 hover:bg-primary/5">
            <Edit3 className="w-4 h-4 mr-2" /> Chỉnh sửa thông tin
          </Button>
        )}
      </div>

      <footer className="text-center text-xs text-muted-foreground pt-4 pb-2 animate-fade-in" style={{ animationDelay: "600ms" }}>
        © 2023 TwelveFit Gym. All rights reserved.
      </footer>
    </div>
  );
};

export default Profile;
