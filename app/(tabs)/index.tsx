import { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

type RemoteOrder = { id: string; customerName: string; deliveryAddress: string; total: string; status: string; items: string };
const statusLabel: Record<string, string> = { new: "جديد", preparing: "قيد التجهيز", ready: "جاهز للاستلام", assigned: "مُسند", in_transit: "في الطريق", delivered: "تم التسليم", cancelled: "ملغى" };
const itemCount = (items: string) => { try { return JSON.parse(items).length; } catch { return 0; } };

export default function CaptainHome() {
  const colors = useColors();
  const [available, setAvailable] = useState(true);
  const mine = trpc.orders.list.useQuery({ scope: "mine" });
  const nearby = trpc.orders.list.useQuery({ scope: "available" });
  const claim = trpc.orders.claim.useMutation({ onSuccess: () => { void mine.refetch(); void nearby.refetch(); } });
  const availability = trpc.orders.setCaptainAvailability.useMutation();
  const orders = useMemo(() => {
    const merged = [...(mine.data ?? []), ...(nearby.data ?? [])];
    return Array.from(new Map(merged.map((order) => [order.id, order])).values()) as RemoteOrder[];
  }, [mine.data, nearby.data]);
  const active = orders.find((order) => order.status === "assigned" || order.status === "in_transit");

  const toggleAvailability = async () => {
    const next = !available;
    setAvailable(next);
    try { await availability.mutateAsync({ availability: next ? "available" : "offline" }); }
    catch { setAvailable(!next); Alert.alert("تعذر تحديث الحالة", "تحقق من تسجيل الدخول والاتصال بالإنترنت."); }
  };
  const acceptDelivery = async (id: string) => {
    try { await claim.mutateAsync({ orderId: id }); Alert.alert("تم قبول الطلب", "تم ربط الطلب بحسابك."); }
    catch { Alert.alert("تعذر قبول الطلب", "قد يكون الطلب أُسند إلى كابتن آخر."); }
  };

  return <ScreenContainer className="px-5" edges={["top", "left", "right"]}><FlatList data={orders.filter((order) => order.id !== active?.id)} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingBottom: 36 }} ListHeaderComponent={<>
    <View className="flex-row items-center justify-between pt-4"><View><Text className="text-sm text-muted">لوحة الكابتن</Text><Text className="mt-1 text-2xl font-bold text-foreground">مرحباً بك</Text></View><Pressable onPress={toggleAvailability} className="flex-row items-center gap-2 rounded-full bg-surface px-3 py-2"><View className={`h-2.5 w-2.5 rounded-full ${available ? "bg-success" : "bg-muted"}`} /><Text className="text-xs font-semibold text-foreground">{available ? "متاح" : "غير متاح"}</Text></Pressable></View>
    <View className="mt-5 flex-row gap-3"><View className="flex-1 rounded-2xl bg-primary p-4"><Text className="text-xs text-background/80">طلباتك الحالية</Text><Text className="mt-2 text-2xl font-bold text-background">{mine.data?.length ?? 0}</Text></View><View className="flex-1 rounded-2xl border border-border bg-surface p-4"><Text className="text-xs text-muted">قريبة منك</Text><Text className="mt-2 text-2xl font-bold text-foreground">{nearby.data?.length ?? 0}</Text></View></View>
    <Text className="mt-6 text-lg font-bold text-foreground">التوصيل النشط</Text>
    {active ? <View className="mt-3 rounded-2xl border border-primary/20 bg-primary/10 p-4"><View className="flex-row items-center justify-between"><View className="flex-row items-center gap-2"><View className="rounded-full bg-primary p-2"><IconSymbol name="paperplane.fill" size={16} color={colors.background} /></View><Text className="text-sm font-bold text-foreground">{active.id}</Text></View><Text className="text-xs font-semibold text-success">{statusLabel[active.status] ?? active.status}</Text></View><Text className="mt-3 text-sm font-semibold text-foreground">{active.customerName}</Text><Text className="mt-1 text-xs text-muted">{active.deliveryAddress} · {itemCount(active.items)} منتجات · {active.total} ر.س</Text></View> : <View className="mt-3 rounded-2xl bg-surface p-4"><Text className="text-sm text-muted">لا يوجد توصيل نشط حالياً.</Text></View>}
    <Text className="mb-3 mt-7 text-lg font-bold text-foreground">طلبات متاحة</Text>
  </>} renderItem={({ item }) => <View className="mb-3 rounded-2xl border border-border bg-surface p-4"><View className="flex-row items-center justify-between"><Text className="text-sm font-bold text-foreground">{item.id}</Text><Text className="text-sm font-bold text-foreground">{item.total} ر.س</Text></View><Text className="mt-2 text-sm text-foreground">{item.customerName}</Text><Text className="mt-1 text-xs text-muted">{item.deliveryAddress} · {itemCount(item.items)} منتجات</Text><View className="mt-3 flex-row items-center justify-between"><Text className="text-xs text-muted">{statusLabel[item.status] ?? item.status}</Text>{item.status === "new" || item.status === "ready" ? <Pressable disabled={claim.isPending} onPress={() => acceptDelivery(item.id)} className="rounded-xl bg-primary px-4 py-2"><Text className="text-xs font-bold text-background">{claim.isPending ? "جارٍ..." : "قبول الطلب"}</Text></Pressable> : <Text className="text-xs font-semibold text-primary">مُسند لك</Text>}</View></View>} ListEmptyComponent={<Text className="py-10 text-center text-sm text-muted">لا توجد طلبات متاحة حالياً.</Text>} /></ScreenContainer>;
}
