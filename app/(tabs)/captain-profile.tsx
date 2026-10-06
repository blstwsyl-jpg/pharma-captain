import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";
import { OAUTH_PORTAL_URL, startOAuthLogin } from "@/constants/oauth";

export default function CaptainProfile() {
  const { user, isAuthenticated, logout } = useAuth({ autoFetch: true });
  const handleAuth = async () => {
    if (isAuthenticated) { await logout(); Alert.alert("تم تسجيل الخروج", "يمكنك تسجيل الدخول مجدداً عند بدء مناوبة جديدة."); return; }
    if (!OAUTH_PORTAL_URL) { Alert.alert("تسجيل الدخول", "أضف إعدادات بوابة المصادقة في بيئة الإنتاج."); return; }
    await startOAuthLogin();
  };
  return <ScreenContainer className="px-5" edges={["top", "left", "right"]}><ScrollView contentContainerStyle={{ paddingTop: 18, paddingBottom: 40 }}><Text className="text-sm text-muted">إدارة الحساب</Text><Text className="mt-1 text-2xl font-bold text-foreground">حسابي</Text><View className="mt-5 items-center rounded-3xl bg-primary p-6"><View className="h-16 w-16 items-center justify-center rounded-full bg-background"><Text className="text-2xl font-bold text-primary">{isAuthenticated ? (user?.name?.slice(0, 1) ?? "ك") : "ك"}</Text></View><Text className="mt-3 text-lg font-bold text-background">{user?.name ?? "حساب الكابتن"}</Text><Text className="mt-1 text-xs text-background/80">{isAuthenticated ? "كابتن توصيل معتمد" : "سجّل الدخول لبدء التوصيل"}</Text></View><Pressable onPress={handleAuth} className="mt-4 rounded-2xl border border-primary p-4"><Text className="text-center font-bold text-primary">{isAuthenticated ? "تسجيل الخروج" : "تسجيل الدخول للكابتن"}</Text></Pressable><View className="mt-5 flex-row gap-3"><View className="flex-1 rounded-2xl bg-surface p-4"><Text className="text-xs text-muted">التقييم</Text><Text className="mt-2 text-xl font-bold text-foreground">4.8 ★</Text></View><View className="flex-1 rounded-2xl bg-surface p-4"><Text className="text-xs text-muted">هذا الشهر</Text><Text className="mt-2 text-xl font-bold text-foreground">24 طلباً</Text></View></View><View className="mt-5 overflow-hidden rounded-2xl border border-border bg-surface"><Pressable onPress={() => Alert.alert("المركبة", "سيتم حفظ بيانات المركبة من لوحة الإدارة.")} className="border-b border-border p-4"><Text className="font-semibold text-foreground">بيانات المركبة</Text><Text className="mt-1 text-xs text-muted">إدارة المركبة ولوحة التسجيل</Text></Pressable><Pressable onPress={() => Alert.alert("المساعدة", "تواصل مع دعم صيدلي عبر لوحة الإدارة.")} className="p-4"><Text className="font-semibold text-foreground">المساعدة والدعم</Text><Text className="mt-1 text-xs text-muted">الحصول على مساعدة من الفريق</Text></Pressable></View></ScrollView></ScreenContainer>;
}
