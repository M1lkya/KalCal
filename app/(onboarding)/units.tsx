import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { useAppTheme } from "@/theme/ThemeContext";
import * as Haptics from "expo-haptics";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

type PreferredUnits = "imperial" | "metric";

type UnitsPageProps = {
  preferredUnits: PreferredUnits | null;
  onChange: (value: PreferredUnits) => void;
  onNext: () => void;
};

const unitOptions: {
  value: PreferredUnits;
  label: string;
  description: string;
}[] = [
  {
    value: "imperial",
    label: "Imperial",
    description: "Pounds, feet, and inches",
  },
  {
    value: "metric",
    label: "Metric",
    description: "Kilograms and centimeters",
  },
];

const UnitsPage = ({ preferredUnits, onChange, onNext }: UnitsPageProps) => {
  const { colors, themeName } = useAppTheme();

  const [progress, setProgress] = React.useState(20);

  const primaryButtonTextColor =
    themeName === "dark" ? colors.background : "#FFFFFF";

  const canContinue = preferredUnits !== null;

  function onUnitPress(value: PreferredUnits) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(value);
  }

  function onContinuePress() {
    if (!canContinue) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onNext();
  }

  return (
    <SafeAreaView
      className="h-full"
      style={{ backgroundColor: colors.background }}
    >
      <View
        className="h-full"
        style={{
          marginHorizontal: scale(18),
        }}
      >
        <View
          className="flex-row items-center"
          style={{
            marginTop: verticalScale(2),
            gap: scale(12),
          }}
        >
          <View
            style={{
              flex: 1,
              height: verticalScale(10),
              backgroundColor: colors.border,
              borderRadius: moderateScale(999),
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${progress}%`,
                backgroundColor: colors.primary,
                borderRadius: moderateScale(999),
              }}
            />
          </View>

          <ThemeSwitcher />
        </View>

        <View
          style={{
            marginTop: verticalScale(30),
          }}
        >
          <Text
            style={{
              color: colors.primary,
              fontSize: moderateScale(13),
              fontWeight: "700",
              letterSpacing: 0.4,
              marginBottom: verticalScale(10),
              textTransform: "uppercase",
            }}
          >
            Preferences
          </Text>

          <Text
            className="font-semibold"
            style={{
              fontSize: moderateScale(38),
              color: colors.text,
              letterSpacing: -1.2,
              lineHeight: moderateScale(43),
            }}
          >
            Choose your units.
          </Text>

          <Text
            style={{
              marginTop: verticalScale(8),
              fontSize: moderateScale(15),
              color: colors.muted,
              lineHeight: moderateScale(22),
              maxWidth: scale(285),
            }}
          >
            Pick the measurement system you want to use throughout the app.
          </Text>
        </View>

        <View
          className="flex-1 items-center justify-center"
          style={{
            gap: verticalScale(12),
          }}
        >
          {unitOptions.map((option) => {
            const selected = preferredUnits === option.value;

            return (
              <Button
                key={option.value}
                variant="outline"
                onPress={() => onUnitPress(option.value)}
                style={{
                  width: "100%",
                  height: verticalScale(68),
                  backgroundColor: selected
                    ? colors.primarySoft
                    : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                  borderWidth: 1,
                  borderRadius: moderateScale(18),
                }}
              >
                <View className="items-center justify-center">
                  <Text
                    className="font-semibold"
                    style={{
                      color: selected ? colors.primary : colors.text,
                      fontSize: moderateScale(16),
                    }}
                  >
                    {option.label}
                  </Text>

                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: moderateScale(13),
                      marginTop: verticalScale(3),
                    }}
                  >
                    {option.description}
                  </Text>
                </View>
              </Button>
            );
          })}
        </View>

        <View
          style={{
            paddingBottom: verticalScale(16),
          }}
        >
          <Button
            disabled={!canContinue}
            onPress={onContinuePress}
            style={{
              height: verticalScale(46),
              backgroundColor: canContinue ? colors.primary : colors.border,
              borderRadius: moderateScale(16),
              opacity: canContinue ? 1 : 0.6,
            }}
          >
            <Text
              className="font-semibold"
              style={{
                color: canContinue ? primaryButtonTextColor : colors.muted,
                fontSize: moderateScale(15),
              }}
            >
              Continue
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UnitsPage;
