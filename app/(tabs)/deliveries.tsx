import { useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

const initial = [
  { id: "#PH-2048", customer: "أحمد سالم", area: "حي النخيل", total: "128.50 ر.س", status: "جديد" },
  { id: "#PH-2046", customer: "مريم عبدالله", area: "حي الزهراء", total: "219.75 ر.س", status: "جاهز للاستلام" },
  { id: "#PH-2043", customer: "خالد حسن", area: "حي الروضة", total: "64.00 ر.س", status: "في الطريق" },
  { id: "#PH-2038", customer: "سلمان علي", area: "حي الياسمين", total: "92.00 ر.س", status: "تم التسليم" },
];

export default function DeliveriesScreen() {
  const colors = useColors();
  const [items, setItems] = useState(initial);
  const accept = (id: string) => { setItems((current) => current.map((item) => item.id === id ? { ...item, status: "في الطريق" } : item)); Alert.alert("تم قبول الطلب", "تذكر تحديث الحالة بعد الاستلام."); };
  return <ScreenContainer className="px-5" edges={["top", "left", "right"]}><FlatList data={items} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingTop: 18, paddingBottom: 30 }} ListHeaderComponent={<View className="mb-5"><Text className="text-sm text-muted">إدارة مهامك اليومية</Text><Text className="mt-1 text-2xl font-bold text-foreground">التوصيلات</Text><View className="mt-4 flex-row gap-2"><View className="flex-1 rounded-2xl bg-primary p-3"><Text className="text-xs text-background/80">مفتوحة</Text><Text className="mt-1 text-xl font-bold text-background">3</Text></View><View className="flex-1 rounded-2xl bg-surface p-3"><Text className="text-xs text-muted">مكتملة اليوم</Text><Text className="mt-1 text-xl font-bold text-foreground">5</Text></View></View></View>} renderItem={({ item }) => <View className="mb-3 rounded-2xl border border-border bg-surface p-4"><View className="flex-row items-center justify-between"><Text className="text-sm font-bold text-foreground">{item.id}</Text><Text className="text-sm font-bold text-primary">{item.total}</Text></View><Text className="mt-3 text-sm font-semibold text-foreground">{item.customer}</Text><Text className="mt-1 text-xs text-muted">{item.area}</Text><View className="mt-4 flex-row items-center justify-between"><Text className={`text-xs font-semibold ${item.status === "تم التسليم" ? "text-success" : item.status === "في الطريق" ? "text-primary" : "text-warning"}`}>{item.status}</Text>{item.status === "جديد" || item.status === "جاهز للاستلام" ? <Pressable onPress={() => accept(item.id)} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]} className="rounded-xl bg-primary px-4 py-2"><Text className="text-xs font-bold text-background">قبول</Text></Pressable> : <Pressable onPress={() => Alert.alert("تفاصيل الطلب", `${item.customer} — ${item.area}`)}><Text className="text-xs font-semibold text-primary">التفاصيل</Text></Pressable>}</View></View>} /></ScreenContainer>;
}
