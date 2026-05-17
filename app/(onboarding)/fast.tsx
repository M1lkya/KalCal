import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { useAppTheme } from "@/theme/ThemeContext";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

type PreferredUnits = "imperial" | "metric";

type WeightPerWeekPageProps = {
  goalRateKgPerWeek: number | null;
  preferredUnits: PreferredUnits | null;
  onChange: (value: number) => void;
  onSubmit: () => void;
};

const KG_PER_LB = 0.45359237;
const LB_PER_KG = 2.2046226218;

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function kgToDisplayRate(valueKg: number, preferredUnits: PreferredUnits) {
  if (preferredUnits === "imperial") {
    return valueKg * LB_PER_KG;
  }

  return valueKg;
}

function displayRateToKg(value: number, preferredUnits: PreferredUnits) {
  if (preferredUnits === "imperial") {
    return value * KG_PER_LB;
  }

  return value;
}

const WeightPerWeekPage = ({
  goalRateKgPerWeek,
  preferredUnits,
  onChange,
  onSubmit,
}: WeightPerWeekPageProps) => {
  const { colors, themeName } = useAppTheme();

  const [progress] = React.useState(80);

  const units = preferredUnits ?? "metric";

  const minimumValue = units === "imperial" ? 0.2 : 0.1;
  const maximumValue = units === "imperial" ? 2.2 : 1.0;
  const middleValue = roundToOneDecimal((minimumValue + maximumValue) / 2);

  const initialValue =
    goalRateKgPerWeek !== null
      ? roundToOneDecimal(kgToDisplayRate(goalRateKgPerWeek, units))
      : middleValue;

  const [speed, setSpeed] = React.useState(initialValue);

  const primaryButtonTextColor =
    themeName === "dark" ? colors.background : "#FFFFFF";

  const unitLabel = units === "imperial" ? "LB" : "KG";

  const speedInKg = displayRateToKg(speed, units);

  const activeSpeed =
    speedInKg < 0.2 ? "slow" : speedInKg > 0.7 ? "fast" : "recommended";

  React.useEffect(() => {
    const nextValue =
      goalRateKgPerWeek !== null
        ? roundToOneDecimal(kgToDisplayRate(goalRateKgPerWeek, units))
        : middleValue;

    setSpeed(nextValue);
  }, [goalRateKgPerWeek, units, middleValue]);

  function onSpeedChange(value: number) {
    const roundedDisplayValue = roundToOneDecimal(value);

    setSpeed(roundedDisplayValue);

    const nextKgValue = roundToOneDecimal(
      displayRateToKg(roundedDisplayValue, units),
    );

    onChange(nextKgValue);
  }

  function onContinuePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const nextKgValue = roundToOneDecimal(displayRateToKg(speed, units));

    onChange(nextKgValue);
    onSubmit();
  }

  function getLabelColor(label: "slow" | "recommended" | "fast") {
    return activeSpeed === label ? colors.primary : colors.muted;
  }

  function getLabelWeight(label: "slow" | "recommended" | "fast") {
    return activeSpeed === label ? "700" : "600";
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
            Setup
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
            How fast do you want to lose weight?
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
            Pick a weekly pace that feels realistic and sustainable.
          </Text>
        </View>

        <View
          className="flex-1 items-center justify-center"
          style={{
            gap: verticalScale(22),
          }}
        >
          <View className="items-center">
            <Text
              style={{
                color: colors.muted,
                fontSize: moderateScale(14),
                fontWeight: "600",
                marginBottom: verticalScale(10),
              }}
            >
              Weight change speed per week
            </Text>

            <Text
              className="font-semibold"
              style={{
                color: colors.text,
                fontSize: moderateScale(48),
                letterSpacing: -1.4,
              }}
            >
              {speed.toFixed(1)} {unitLabel}
            </Text>
          </View>

          <View style={{ width: "100%" }}>
            <View
              className="flex-row items-center"
              style={{
                marginBottom: verticalScale(12),
              }}
            >
              <View className="flex-1">
                <Text
                  style={{
                    color: getLabelColor("slow"),
                    fontSize: moderateScale(13),
                    fontWeight: getLabelWeight("slow"),
                    textAlign: "left",
                  }}
                >
                  Slow
                </Text>
              </View>

              <View className="flex-1">
                <Text
                  style={{
                    color: getLabelColor("recommended"),
                    fontSize: moderateScale(13),
                    fontWeight: getLabelWeight("recommended"),
                    textAlign: "center",
                  }}
                >
                  Recommended
                </Text>
              </View>

              <View className="flex-1">
                <Text
                  style={{
                    color: getLabelColor("fast"),
                    fontSize: moderateScale(13),
                    fontWeight: getLabelWeight("fast"),
                    textAlign: "right",
                  }}
                >
                  Fast
                </Text>
              </View>
            </View>

            <Slider
              style={{
                width: "100%",
                height: verticalScale(42),
              }}
              minimumValue={minimumValue}
              maximumValue={maximumValue}
              step={0.1}
              value={speed}
              onValueChange={onSpeedChange}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
            />
          </View>
        </View>

        <View
          style={{
            paddingBottom: verticalScale(16),
          }}
        >
          <Button
            onPress={onContinuePress}
            style={{
              height: verticalScale(46),
              backgroundColor: colors.primary,
              borderRadius: moderateScale(16),
            }}
          >
            <Text
              className="font-semibold"
              style={{
                color: primaryButtonTextColor,
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

export default WeightPerWeekPage;
