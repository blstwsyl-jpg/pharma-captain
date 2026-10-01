import { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

type Delivery = { id: string; customer: string; area: string; items: number; total: string; state: "جديد" | "جاهز للاستلام" | "في الطريق" };

const seedDeliveries: Delivery[] = [
  { id: "#PH-2048", customer: "أحمد سالم", area: "حي النخيل", items: 3, total: "128.50 ر.س", state: "جديد" },
  { id: "#PH-2046", customer: "مريم عبدالله", area: "حي الزهراء", items: 5, total: "219.75 ر.س", state: "جاهز للاستلام" },
  { id: "#PH-2043", customer: "خالد حسن", area: "حي الروضة", items: 2, total: "64.00 ر.س", state: "في الطريق" },
];

export default function CaptainHome() {
  const colors = useColors();
  const router = useRouter();
  const [available, setAvailable] = useState(true);
  const [deliveries, setDeliveries] = useState(seedDeliveries);
  const active = useMemo(() => deliveries.find((delivery) => delivery.state === "في الطريق"), [deliveries]);

  const acceptDelivery = (id: string) => {
    setDeliveries((current) => current.map((delivery) => delivery.id === id ? { ...delivery, state: "في الطريق" } : delivery));
    Alert.alert("تم قبول الطلب", "سيظهر الطلب الآن في قائمة التوصيل النشط.");
  };

  return (
    <ScreenContainer className="px-5" edges={["top", "left", "right"]}>
      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 36 }}
        ListHeaderComponent={<>
          <View className="flex-row items-center justify-between pt-4">
            <View><Text className="text-sm text-muted">الأحد، 28 سبتمبر</Text><Text className="mt-1 text-2xl font-bold text-foreground">مرحباً، عمر</Text></View>
            <Pressable onPress={() => setAvailable((value) => !value)} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]} className="flex-row items-center gap-2 rounded-full bg-surface px-3 py-2"><View className={`h-2.5 w-2.5 rounded-full ${available ? "bg-success" : "bg-muted"}`} /><Text className="text-xs font-semibold text-foreground">{available ? "متاح" : "غير متاح"}</Text></Pressable>
          </View>
          <View className="mt-5 flex-row gap-3"><View className="flex-1 rounded-2xl bg-primary p-4"><Text className="text-xs text-background/80">توصيلات اليوم</Text><Text className="mt-2 text-2xl font-bold text-background">8</Text><Text className="mt-1 text-xs text-background/80">+2 عن أمس</Text></View><View className="flex-1 rounded-2xl border border-border bg-surface p-4"><Text className="text-xs text-muted">أرباح اليوم</Text><Text className="mt-2 text-xl font-bold text-foreground">184 ر.س</Text><Text className="mt-1 text-xs text-success">قيد التسوية</Text></View></View>
          <View className="mt-6 flex-row items-center justify-between"><Text className="text-lg font-bold text-foreground">التوصيل النشط</Text><Pressable onPress={() => router.push("/(tabs)/deliveries")}><Text className="text-xs font-semibold text-primary">عرض الكل</Text></Pressable></View>
          {active ? <Pressable onPress={() => Alert.alert("التوصيل النشط", `${active.id} — ${active.area}`)} style={({ pressed }) => [{ opacity: pressed ? 0.86 : 1 }]} className="mt-3 rounded-2xl border border-primary/20 bg-primary/10 p-4"><View className="flex-row items-center justify-between"><View className="flex-row items-center gap-2"><View className="rounded-full bg-primary p-2"><IconSymbol name="paperplane.fill" size={16} color={colors.background} /></View><Text className="text-sm font-bold text-foreground">{active.id}</Text></View><Text className="rounded-full bg-success/15 px-2 py-1 text-xs font-semibold text-success">في الطريق</Text></View><Text className="mt-3 text-sm font-semibold text-foreground">{active.customer}</Text><Text className="mt-1 text-xs text-muted">{active.area} · {active.items} منتجات · {active.total}</Text><View className="mt-4 flex-row items-center justify-between"><Text className="text-xs font-semibold text-primary">عرض تفاصيل التوصيل</Text><IconSymbol name="chevron.right" size={16} color={colors.primary} /></View></Pressable> : <View className="mt-3 rounded-2xl bg-surface p-4"><Text className="text-sm text-muted">لا يوجد توصيل نشط حالياً.</Text></View>}
          <Text className="mb-3 mt-7 text-lg font-bold text-foreground">طلبات قريبة منك</Text>
        </>}
        renderItem={({ item }) => <View className="mb-3 rounded-2xl border border-border bg-surface p-4"><View className="flex-row items-center justify-between"><Text className="text-sm font-bold text-foreground">{item.id}</Text><Text className="text-sm font-bold text-foreground">{item.total}</Text></View><Text className="mt-2 text-sm text-foreground">{item.customer}</Text><Text className="mt-1 text-xs text-muted">{item.area} · {item.items} منتجات</Text><View className="mt-3 flex-row items-center justify-between"><Text className="text-xs text-muted">{item.state}</Text>{item.state !== "في الطريق" ? <Pressable onPress={() => acceptDelivery(item.id)} style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }]} className="rounded-xl bg-primary px-4 py-2"><Text className="text-xs font-bold text-background">قبول الطلب</Text></Pressable> : <Text className="text-xs font-semibold text-success">قيد التوصيل</Text>}</View></View>}
      />
    </ScreenContainer>
  );
}
