import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function CaptainTabs() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.tint, tabBarButton: HapticTab, tabBarStyle: { paddingTop: 8, paddingBottom: bottomPadding, height: 56 + bottomPadding, backgroundColor: colors.background, borderTopColor: colors.border } }}>
    <Tabs.Screen name="index" options={{ title: "الرئيسية", tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={25} color={color} /> }} />
    <Tabs.Screen name="deliveries" options={{ title: "التوصيلات", tabBarIcon: ({ color }) => <IconSymbol name="paperplane.fill" size={25} color={color} /> }} />
    <Tabs.Screen name="captain-profile" options={{ title: "حسابي", tabBarIcon: ({ color }) => <IconSymbol name="chevron.right" size={25} color={color} /> }} />
  </Tabs>;
}
