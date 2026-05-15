import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useColorScheme } from "react-native";

type ThemePreference = "system" | "light" | "dark";
type ThemeName = "light" | "dark";

const THEME_KEY = "theme-preference";

const themes = {
  light: {
    background: "#F5F5F4",
    surface: "#FFFFFF",
    text: "#18181B",
    muted: "#71717A",
    border: "#E4E4E7",
    primary: "#18181B",
    primarySoft: "#E4E4E7",
  },
  dark: {
    background: "#09090B",
    surface: "#18181B",
    text: "#FAFAFA",
    muted: "#A1A1AA",
    border: "#27272A",
    primary: "#FAFAFA",
    primarySoft: "#27272A",
  },
};

type ThemeContextValue = {
  preference: ThemePreference;
  themeName: ThemeName;
  colors: typeof themes.light;
  setPreference: (theme: ThemePreference) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    async function loadTheme() {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);

      if (
        savedTheme === "system" ||
        savedTheme === "light" ||
        savedTheme === "dark"
      ) {
        setPreferenceState(savedTheme);
      }
    }

    loadTheme();
  }, []);

  const setPreference = async (theme: ThemePreference) => {
    setPreferenceState(theme);
    await AsyncStorage.setItem(THEME_KEY, theme);
  };

  const themeName: ThemeName =
    preference === "system" ? (systemTheme ?? "light") : preference;

  const value = useMemo(
    () => ({
      preference,
      themeName,
      colors: themes[themeName],
      setPreference,
    }),
    [preference, themeName],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used inside AppThemeProvider");
  }

  return context;
}
