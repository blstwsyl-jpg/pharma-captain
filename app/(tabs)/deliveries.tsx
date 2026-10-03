import { useMemo } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

const statusLabel: Record<string, string> = { new: "جديد", preparing: "قيد التجهيز", ready: "جاهز للاستلام", assigned: "مُسند", in_transit: "في الطريق", delivered: "تم التسليم", cancelled: "ملغى" };
const nextStatus: Record<string, "in_transit" | "delivered"> = { assigned: "in_transit", in_transit: "delivered" };
const itemCount = (items: string) => { try { return JSON.parse(items).length; } catch { return 0; } };

export default function DeliveriesScreen() {
  const orders = trpc.orders.list.useQuery({ scope: "mine" });
  const setStatus = trpc.orders.setStatus.useMutation({ onSuccess: () => void orders.refetch() });
  const visible = useMemo(() => orders.data ?? [], [orders.data]);
  const advance = async (id: string, status: string) => {
    const next = nextStatus[status];
    if (!next) return;
    try { await setStatus.mutateAsync({ orderId: id, status: next }); }
    catch { Alert.alert("تعذر تحديث الطلب", "تحقق من صلاحيات الكابتن والاتصال."); }
  };
  return <ScreenContainer className="px-5" edges={["top", "left", "right"]}><FlatList data={visible} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingTop: 18, paddingBottom: 30 }} ListHeaderComponent={<View className="mb-5"><Text className="text-sm text-muted">بيانات مباشرة من الخادم</Text><Text className="mt-1 text-2xl font-bold text-foreground">توصيلاتي</Text><View className="mt-4 flex-row gap-2"><View className="flex-1 rounded-2xl bg-primary p-3"><Text className="text-xs text-background/80">الإجمالي</Text><Text className="mt-1 text-xl font-bold text-background">{visible.length}</Text></View><View className="flex-1 rounded-2xl bg-surface p-3"><Text className="text-xs text-muted">مكتملة</Text><Text className="mt-1 text-xl font-bold text-foreground">{visible.filter((item) => item.status === "delivered").length}</Text></View></View></View>} renderItem={({ item }) => <View className="mb-3 rounded-2xl border border-border bg-surface p-4"><View className="flex-row items-center justify-between"><Text className="text-sm font-bold text-foreground">{item.id}</Text><Text className="text-sm font-bold text-primary">{item.total} ر.س</Text></View><Text className="mt-3 text-sm font-semibold text-foreground">{item.customerName}</Text><Text className="mt-1 text-xs text-muted">{item.deliveryAddress} · {itemCount(item.items)} منتجات</Text><View className="mt-4 flex-row items-center justify-between"><Text className="text-xs font-semibold text-primary">{statusLabel[item.status] ?? item.status}</Text>{nextStatus[item.status] ? <Pressable disabled={setStatus.isPending} onPress={() => advance(item.id, item.status)} className="rounded-xl bg-primary px-4 py-2"><Text className="text-xs font-bold text-background">{setStatus.isPending ? "جارٍ..." : item.status === "assigned" ? "بدأت التوصيل" : "تأكيد التسليم"}</Text></Pressable> : <Text className="text-xs text-muted">لا إجراء مطلوب</Text>}</View></View>} ListEmptyComponent={<Text className="py-12 text-center text-sm text-muted">لا توجد توصيلات مرتبطة بحسابك.</Text>} /></ScreenContainer>;
}
