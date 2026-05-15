import { useAppTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";

const themeOrder = ["system", "light", "dark"] as const;

export default function ThemeSwitcher() {
  const { preference, setPreference, colors, themeName } = useAppTheme();

  async function onToggleTheme() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const currentIndex = themeOrder.indexOf(preference);
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];

    await setPreference(nextTheme);
  }

  const iconName =
    preference === "system"
      ? "phone-portrait"
      : themeName === "dark"
        ? "moon"
        : "sunny";

  return (
    <Pressable
      onPress={onToggleTheme}
      accessibilityRole="button"
      accessibilityLabel={`Switch theme. Current theme is ${preference}.`}
      style={{
        width: 44,
        height: 44,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.text,
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
      }}
    >
      <Ionicons name={iconName} size={23} color={colors.text} />
    </Pressable>
  );
}
