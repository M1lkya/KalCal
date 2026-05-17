import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { useAppTheme } from "@/theme/ThemeContext";
import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

type GoalType = "maintain" | "lose" | "gain";
type UnitPreference = "imperial" | "metric";

type GoalWeightPageProps = {
  onNext: () => void;
  onChange: (goalWeightKg: number) => void;
  goalWeightKg: number | null;
  currentWeightKg: number | null;
  unitPreference: UnitPreference | null;
  goalType: GoalType | null;
};

const TICK_WIDTH = 8;
const DECIMALS_PER_UNIT = 10;

const KG_PER_LB = 0.45359237;
const LB_PER_KG = 2.2046226218;

const PAGE_MARGIN = scale(14);
const SCREEN_WIDTH = Dimensions.get("window").width;
const SLIDER_WIDTH = SCREEN_WIDTH - PAGE_MARGIN * 2;
const SIDE_PADDING = SLIDER_WIDTH / 2 - TICK_WIDTH / 2;

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function kgToDisplayWeight(weightKg: number, unitPreference: UnitPreference) {
  if (unitPreference === "imperial") {
    return weightKg * LB_PER_KG;
  }

  return weightKg;
}

function displayWeightToKg(weight: number, unitPreference: UnitPreference) {
  if (unitPreference === "imperial") {
    return weight * KG_PER_LB;
  }

  return weight;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const GoalWeightPage = ({
  onNext,
  onChange,
  goalWeightKg,
  currentWeightKg,
  unitPreference,
  goalType,
}: GoalWeightPageProps) => {
  const { colors, themeName } = useAppTheme();

  const listRef = useRef<FlatList<number> | null>(null);
  const hasSkippedRef = useRef(false);

  const units = unitPreference ?? "metric";

  const baseMin = 1;
  const baseMax = units === "imperial" ? 600 : 272;
  const defaultStart = units === "imperial" ? 150 : 68;

  const currentDisplayWeight =
    currentWeightKg !== null
      ? roundToOneDecimal(kgToDisplayWeight(currentWeightKg, units))
      : null;

  const min =
    goalType === "gain" && currentDisplayWeight !== null
      ? clamp(currentDisplayWeight, baseMin, baseMax)
      : baseMin;

  const max =
    goalType === "lose" && currentDisplayWeight !== null
      ? clamp(currentDisplayWeight, baseMin, baseMax)
      : baseMax;

  const fallbackStart =
    goalType === "lose" && currentDisplayWeight !== null
      ? currentDisplayWeight
      : goalType === "gain" && currentDisplayWeight !== null
        ? currentDisplayWeight
        : defaultStart;

  const startValue =
    goalWeightKg !== null
      ? kgToDisplayWeight(goalWeightKg, units)
      : fallbackStart;

  const safeStartValue = clamp(roundToOneDecimal(startValue), min, max);

  const minTenths = Math.round(min * DECIMALS_PER_UNIT);
  const maxTenths = Math.round(max * DECIMALS_PER_UNIT);
  const startTenths = Math.round(safeStartValue * DECIMALS_PER_UNIT);

  const tickCount = maxTenths - minTenths + 1;
  const startIndex = startTenths - minTenths;

  const [value, setValue] = useState(safeStartValue);
  const [progress] = useState(50);

  const tickData = useMemo(
    () => Array.from({ length: tickCount }, (_, index) => index),
    [tickCount],
  );

  const primaryButtonTextColor =
    themeName === "dark" ? colors.background : "#FFFFFF";

  const depthCoverColor =
    themeName === "dark"
      ? "rgba(255, 255, 255, 0.28)"
      : "rgba(15, 23, 42, 0.28)";

  const unitLabel = units === "imperial" ? "lb" : "kg";

  const actionLabel = goalType === "gain" ? "Gain weight" : "Lose weight";

  const helperText =
    goalType === "gain"
      ? "Choose a goal weight above your current weight."
      : "Choose a goal weight below your current weight.";

  const displayValue = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);

  useEffect(() => {
    if (goalType === "maintain" && !hasSkippedRef.current) {
      hasSkippedRef.current = true;
      onNext();
    }
  }, [goalType, onNext]);

  useEffect(() => {
    setValue(safeStartValue);

    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        offset: startIndex * TICK_WIDTH,
        animated: false,
      });
    });
  }, [safeStartValue, startIndex]);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / TICK_WIDTH);

    const nextTenths = Math.min(
      maxTenths,
      Math.max(minTenths, minTenths + index),
    );

    setValue(nextTenths / DECIMALS_PER_UNIT);
  }

  function onContinuePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const nextGoalWeightKg = displayWeightToKg(value, units);

    onChange(roundToOneDecimal(nextGoalWeightKg));
    onNext();
  }

  if (goalType === "maintain") {
    return null;
  }

  return (
    <SafeAreaView
      className="h-full"
      style={{ backgroundColor: colors.background }}
    >
      <View
        className="h-full"
        style={{
          marginHorizontal: PAGE_MARGIN,
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
            What's your goal weight?
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
            {helperText}
          </Text>
        </View>

        <View className="flex-1 items-center justify-center">
          <Text
            style={{
              color: colors.primary,
              fontSize: moderateScale(14),
              fontWeight: "700",
              letterSpacing: 0.3,
              marginBottom: verticalScale(8),
              textTransform: "uppercase",
            }}
          >
            {actionLabel}
          </Text>

          <Text
            style={{
              fontSize: moderateScale(48),
              fontWeight: "700",
              textAlign: "center",
              marginBottom: verticalScale(34),
              color: colors.text,
              letterSpacing: -1.4,
            }}
          >
            {displayValue} {unitLabel}
          </Text>

          <View
            style={{
              height: verticalScale(120),
              justifyContent: "center",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <FlatList
              ref={listRef}
              data={tickData}
              horizontal
              keyExtractor={(item) => item.toString()}
              showsHorizontalScrollIndicator={false}
              snapToInterval={TICK_WIDTH}
              decelerationRate="fast"
              bounces={false}
              scrollEventThrottle={16}
              onScroll={handleScroll}
              initialScrollIndex={startIndex}
              getItemLayout={(_, index) => ({
                length: TICK_WIDTH,
                offset: TICK_WIDTH * index,
                index,
              })}
              contentContainerStyle={{
                paddingHorizontal: SIDE_PADDING,
                alignItems: "center",
              }}
              initialNumToRender={80}
              maxToRenderPerBatch={80}
              windowSize={7}
              removeClippedSubviews
              renderItem={({ item }) => {
                const tenths = minTenths + item;
                const isWholeUnit = tenths % DECIMALS_PER_UNIT === 0;

                return (
                  <View
                    style={{
                      width: TICK_WIDTH,
                      height: verticalScale(70),
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <View
                      style={{
                        width: 2,
                        height: isWholeUnit
                          ? verticalScale(42)
                          : verticalScale(18),
                        backgroundColor: colors.text,
                        opacity: isWholeUnit ? 1 : 0.35,
                        borderRadius: 999,
                      }}
                    />
                  </View>
                );
              }}
            />

            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                left: "50%",
                right: 0,
                top: verticalScale(25),
                bottom: verticalScale(25),
                backgroundColor: depthCoverColor,
                zIndex: 5,
              }}
            />

            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                left: "50%",
                marginLeft: -1,
                bottom: verticalScale(25),
                height: verticalScale(70),
                width: 2,
                backgroundColor: colors.primary,
                borderRadius: 999,
                zIndex: 10,
              }}
            />
          </View>

          {currentDisplayWeight !== null ? (
            <Text
              style={{
                color: colors.muted,
                fontSize: moderateScale(13),
                marginTop: verticalScale(16),
                textAlign: "center",
              }}
            >
              Current weight: {currentDisplayWeight} {unitLabel}
            </Text>
          ) : null}
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

export default GoalWeightPage;
