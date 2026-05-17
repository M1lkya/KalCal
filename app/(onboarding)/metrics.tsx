import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { useAppTheme } from "@/theme/ThemeContext";
import * as Haptics from "expo-haptics";
import React from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

type PreferredUnits = "imperial" | "metric";

type MetricsPageProps = {
  preferredUnits: PreferredUnits | null;
  onNext: (metrics: {
    age: number;
    heightCm: number;
    currentWeightKg: number;
  }) => void;
};

function parseNumber(value: string) {
  return Number(value.trim().replace(",", "."));
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

const MetricsPage = ({ preferredUnits, onNext }: MetricsPageProps) => {
  const { colors, themeName } = useAppTheme();

  const [progress] = React.useState(30);
  const [keyboardOpen, setKeyboardOpen] = React.useState(false);

  const [age, setAge] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [weight, setWeight] = React.useState("");

  const units = preferredUnits ?? "metric";

  const heightPlaceholder = units === "imperial" ? "in" : "cm";
  const weightPlaceholder = units === "imperial" ? "lb" : "kg";

  const ageNumber = parseNumber(age);
  const heightNumber = parseNumber(height);
  const weightNumber = parseNumber(weight);

  const canContinue =
    Number.isFinite(ageNumber) &&
    ageNumber > 0 &&
    Number.isFinite(heightNumber) &&
    heightNumber > 0 &&
    Number.isFinite(weightNumber) &&
    weightNumber > 0;

  const primaryButtonTextColor =
    themeName === "dark" ? colors.background : "#FFFFFF";

  React.useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setKeyboardOpen(true);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  function onContinuePress() {
    if (!canContinue) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const heightCm = units === "imperial" ? heightNumber * 2.54 : heightNumber;

    const currentWeightKg =
      units === "imperial" ? weightNumber * 0.45359237 : weightNumber;

    onNext({
      age: Math.floor(ageNumber),
      heightCm: roundToOneDecimal(heightCm),
      currentWeightKg: roundToOneDecimal(currentWeightKg),
    });
  }

  return (
    <SafeAreaView
      className="h-full"
      style={{ backgroundColor: colors.background }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <View
          style={{
            flex: 1,
            marginHorizontal: scale(14),
          }}
        >
          <ScrollView
            style={{ flex: 1 }}
            scrollEnabled={keyboardOpen}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: keyboardOpen
                ? verticalScale(24)
                : verticalScale(0),
            }}
          >
            <View style={{ flex: 1 }}>
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
                  Let's get your metrics.
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
                  Add a few details so your plan can be set up correctly.
                </Text>
              </View>

              <View
                className="flex-1 items-center justify-center"
                style={{
                  gap: verticalScale(12),
                  paddingTop: keyboardOpen
                    ? verticalScale(26)
                    : verticalScale(0),
                  paddingBottom: keyboardOpen
                    ? verticalScale(26)
                    : verticalScale(0),
                }}
              >
                <View
                  className="flex-row"
                  style={{
                    width: "100%",
                    gap: scale(6),
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      className="font-semibold"
                      style={{
                        color: colors.text,
                        fontSize: moderateScale(14),
                        marginBottom: verticalScale(7),
                      }}
                    >
                      Height
                    </Text>

                    <Input
                      style={{
                        height: verticalScale(52),
                        fontSize: moderateScale(15),
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.text,
                        borderRadius: moderateScale(18),
                      }}
                      placeholderTextColor={colors.muted}
                      keyboardType="number-pad"
                      value={height}
                      onChangeText={setHeight}
                      placeholder={heightPlaceholder}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      className="font-semibold"
                      style={{
                        color: colors.text,
                        fontSize: moderateScale(14),
                        marginBottom: verticalScale(7),
                      }}
                    >
                      Age
                    </Text>

                    <Input
                      style={{
                        height: verticalScale(52),
                        fontSize: moderateScale(15),
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.text,
                        borderRadius: moderateScale(18),
                      }}
                      placeholderTextColor={colors.muted}
                      keyboardType="number-pad"
                      value={age}
                      onChangeText={setAge}
                      placeholder="years"
                    />
                  </View>
                </View>

                <View style={{ width: "100%" }}>
                  <Text
                    className="font-semibold"
                    style={{
                      color: colors.text,
                      fontSize: moderateScale(14),
                      marginBottom: verticalScale(7),
                    }}
                  >
                    Weight
                  </Text>

                  <Input
                    style={{
                      height: verticalScale(52),
                      fontSize: moderateScale(15),
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                      borderRadius: moderateScale(18),
                    }}
                    placeholderTextColor={colors.muted}
                    keyboardType="number-pad"
                    value={weight}
                    onChangeText={setWeight}
                    placeholder={weightPlaceholder}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              paddingTop: verticalScale(10),
              paddingBottom: keyboardOpen
                ? verticalScale(14)
                : verticalScale(16),
              backgroundColor: colors.background,
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MetricsPage;
