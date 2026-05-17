import CircleProgress from "@/components/ui/circleProgressBar";
import GramsCircleProgress from "@/components/ui/gramsCircleBar";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { api } from "@/convex/_generated/api";
import { useAppTheme } from "@/theme/ThemeContext";
import { useUser } from "@clerk/expo";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

type WeekDay = {
  label: string;
  date: string;
  dayNumber: string;
  isToday: boolean;
};

type DailyLog = {
  date: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
};

const DANGER_COLOR = "#EF4444";

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentLocalWeek() {
  const today = new Date();
  const todayDay = today.getDay();

  const mondayOffset = todayDay === 0 ? -6 : 1 - todayDay;

  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() + mondayOffset);

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const todayIso = formatLocalDate(today);

  return labels.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    const isoDate = formatLocalDate(date);

    return {
      label,
      date: isoDate,
      dayNumber: String(date.getDate()),
      isToday: isoDate === todayIso,
    };
  });
}

function getNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeDailyLog(date: string, log: any): DailyLog {
  return {
    date,
    calories: getNumber(log?.calories),
    proteinGrams: getNumber(log?.proteinGrams ?? log?.protienGrams),
    carbsGrams: getNumber(log?.carbsGrams),
    fatGrams: getNumber(log?.fatGrams),
  };
}

function percent(eaten: number, goal: number) {
  if (!goal || goal <= 0) return 0;

  return Math.min(eaten / goal, 1);
}

function isOverTarget(eaten: number, goal: number) {
  return goal > 0 && eaten > goal;
}

const Home = () => {
  const { colors } = useAppTheme();
  const { isSignedIn, user, isLoaded } = useUser();

  const weekDays = React.useMemo(() => getCurrentLocalWeek(), []);

  const todayInWeek = weekDays.find((day) => day.isToday);

  const selectedDefaultDate =
    todayInWeek?.date ?? weekDays[0]?.date ?? formatLocalDate(new Date());

  const [selectedDate, setSelectedDate] = React.useState(selectedDefaultDate);

  const weekStartDate = weekDays[0]?.date ?? selectedDefaultDate;
  const weekEndDate = weekDays[6]?.date ?? selectedDefaultDate;

  const weekKey = React.useMemo(
    () => weekDays.map((day) => day.date).join(","),
    [weekDays],
  );

  const ensureDailyLogForDate = useMutation(
    api.functions.food.ensureDailyLogForDate,
  );

  const convexUser = useQuery(
    api.functions.user.getUser,
    isSignedIn ? {} : "skip",
  );

  const dailyLogs = useQuery(
    api.functions.food.getDailyLogsForDateRange,
    isSignedIn
      ? {
          startDate: weekStartDate,
          endDate: weekEndDate,
        }
      : "skip",
  );

  React.useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      router.replace("/SignUp");
    }
  }, [isLoaded, isSignedIn, user]);

  React.useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;

    let cancelled = false;

    async function ensureWeekLogs() {
      await Promise.all(
        weekDays.map(async (day) => {
          try {
            if (cancelled) return;

            await ensureDailyLogForDate({
              date: day.date,
            });
          } catch (error) {
            console.error("Failed to ensure daily log:", day.date, error);
          }
        }),
      );
    }

    ensureWeekLogs();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, weekKey, ensureDailyLogForDate]);

  const logsByDate = React.useMemo(() => {
    const map: Record<string, DailyLog> = {};

    for (const day of weekDays) {
      map[day.date] = normalizeDailyLog(day.date, {
        calories: 0,
        proteinGrams: 0,
        carbsGrams: 0,
        fatGrams: 0,
      });
    }

    for (const log of dailyLogs ?? []) {
      map[log.date] = normalizeDailyLog(log.date, log);
    }

    return map;
  }, [dailyLogs, weekDays]);

  function handleDayPress(day: WeekDay) {
    setSelectedDate(day.date);
  }

  const selectedLog =
    logsByDate[selectedDate] ??
    normalizeDailyLog(selectedDate, {
      calories: 0,
      proteinGrams: 0,
      carbsGrams: 0,
      fatGrams: 0,
    });

  const caloriesEaten = selectedLog.calories;
  const proteinEaten = selectedLog.proteinGrams;
  const carbsEaten = selectedLog.carbsGrams;
  const fatEaten = selectedLog.fatGrams;

  const nutritionTargets = convexUser?.nutritionTargets;

  const calorieGoal = getNumber(nutritionTargets?.caloriesKcal);
  const proteinGoal = getNumber(nutritionTargets?.proteinGrams);
  const carbsGoal = getNumber(nutritionTargets?.carbsGrams);
  const fatGoal = getNumber(nutritionTargets?.fatGrams);

  const calorieProgress = percent(caloriesEaten, calorieGoal);
  const caloriesOverTarget = isOverTarget(caloriesEaten, calorieGoal);

  const macros = [
    {
      key: "protein",
      label: "Protein",
      eaten: proteinEaten,
      goal: proteinGoal,
      progress: percent(proteinEaten, proteinGoal),
      isOver: isOverTarget(proteinEaten, proteinGoal),
    },
    {
      key: "carbs",
      label: "Carbs",
      eaten: carbsEaten,
      goal: carbsGoal,
      progress: percent(carbsEaten, carbsGoal),
      isOver: isOverTarget(carbsEaten, carbsGoal),
    },
    {
      key: "fat",
      label: "Fat",
      eaten: fatEaten,
      goal: fatGoal,
      progress: percent(fatEaten, fatGoal),
      isOver: isOverTarget(fatEaten, fatGoal),
    },
  ] as const;

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(28),
        }}
      >
        <View
          style={{
            marginHorizontal: scale(18),
            marginTop: verticalScale(10),
          }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text
                className="font-semibold"
                style={{
                  color: colors.text,
                  fontSize: moderateScale(34),
                  letterSpacing: -1.1,
                }}
              >
                KalCal
              </Text>

              <Text
                style={{
                  color: colors.muted,
                  fontSize: moderateScale(15),
                  marginTop: verticalScale(4),
                }}
              >
                Today&apos;s nutrition overview
              </Text>
            </View>

            <ThemeSwitcher />
          </View>

          <View
            className="flex-row"
            style={{
              marginTop: verticalScale(24),
              gap: scale(7),
            }}
          >
            {weekDays.map((day) => {
              const isSelected = selectedDate === day.date;

              const dayLog =
                logsByDate[day.date] ??
                normalizeDailyLog(day.date, {
                  calories: 0,
                  proteinGrams: 0,
                  carbsGrams: 0,
                  fatGrams: 0,
                });

              const dayProgress = percent(dayLog.calories, calorieGoal);
              const dayCaloriesOverTarget = isOverTarget(
                dayLog.calories,
                calorieGoal,
              );

              return (
                <TouchableOpacity
                  key={day.date}
                  activeOpacity={0.85}
                  style={{ flex: 1 }}
                  onPress={() => handleDayPress(day)}
                >
                  <View
                    style={{
                      height: verticalScale(58),
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isSelected
                        ? colors.primarySoft
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: 1,
                      borderRadius: moderateScale(16),
                    }}
                  >
                    <Text
                      className="font-semibold"
                      style={{
                        color: isSelected ? colors.primary : colors.muted,
                        fontSize: moderateScale(11),
                        marginBottom: verticalScale(3),
                      }}
                    >
                      {day.label}
                    </Text>

                    <Text
                      className="font-semibold"
                      style={{
                        color: isSelected ? colors.primary : colors.text,
                        fontSize: moderateScale(16),
                      }}
                    >
                      {day.dayNumber}
                    </Text>

                    <View
                      style={{
                        marginTop: verticalScale(4),
                        height: verticalScale(3),
                        width: "60%",
                        backgroundColor: colors.border,
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          height: "100%",
                          width: `${dayProgress * 100}%`,
                          backgroundColor: dayCaloriesOverTarget
                            ? DANGER_COLOR
                            : "#FFFFFF",
                          borderRadius: 999,
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View
            style={{
              marginTop: verticalScale(24),
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: moderateScale(28),
              paddingVertical: verticalScale(24),
              paddingHorizontal: scale(18),
              shadowColor: colors.text,
              shadowOpacity: 0.04,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 12 },
              elevation: 2,
            }}
          >
            <View className="flex-row items-center">
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.muted,
                    fontSize: moderateScale(14),
                    fontWeight: "600",
                    marginBottom: verticalScale(8),
                  }}
                >
                  Calories eaten
                </Text>

                <View className="flex-row items-end">
                  <Text
                    className="font-semibold"
                    style={{
                      color: caloriesOverTarget ? DANGER_COLOR : colors.text,
                      fontSize: moderateScale(46),
                      letterSpacing: -1.5,
                    }}
                  >
                    {caloriesEaten}
                  </Text>

                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: moderateScale(16),
                      marginBottom: verticalScale(8),
                      marginLeft: scale(4),
                    }}
                  >
                    / {calorieGoal || "—"}
                  </Text>
                </View>

                <Text
                  style={{
                    color: colors.muted,
                    fontSize: moderateScale(13),
                    lineHeight: moderateScale(19),
                    marginTop: verticalScale(4),
                  }}
                >
                  {caloriesOverTarget
                    ? "You went over your calorie target for this day."
                    : caloriesEaten > 0
                      ? "Keep tracking your meals for this day."
                      : "Add a meal to start tracking this day."}
                </Text>
              </View>

              <CircleProgress
                progress={calorieProgress}
                size={118}
                strokeWidth={12}
                color={caloriesOverTarget ? DANGER_COLOR : colors.primary}
                trackColor={colors.border}
                textColor={colors.text}
                containerClassName="rounded-full"
                textClassName="tracking-tight"
              />
            </View>
          </View>

          <View
            className="flex-row"
            style={{
              marginTop: verticalScale(14),
              gap: scale(8),
            }}
          >
            {macros.map((macro) => {
              return (
                <View
                  key={macro.key}
                  style={{
                    flex: 1,
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    borderRadius: moderateScale(20),
                    paddingVertical: verticalScale(14),
                    paddingHorizontal: scale(8),
                  }}
                >
                  <View className="items-center">
                    <GramsCircleProgress
                      progress={macro.progress}
                      size={82}
                      text={macro.key}
                      strokeWidth={8}
                      color={macro.isOver ? DANGER_COLOR : colors.primary}
                      trackColor={colors.border}
                      textColor={colors.text}
                      containerClassName="rounded-full"
                      textClassName="tracking-tight"
                    />

                    <Text
                      className="font-semibold"
                      style={{
                        color: macro.isOver ? DANGER_COLOR : colors.text,
                        fontSize: moderateScale(20),
                        marginTop: verticalScale(10),
                      }}
                    >
                      {macro.eaten}g
                    </Text>

                    <Text
                      style={{
                        color: colors.muted,
                        fontSize: moderateScale(12),
                        marginTop: verticalScale(2),
                      }}
                    >
                      of {macro.goal || "—"}g
                    </Text>

                    <Text
                      className="font-semibold"
                      style={{
                        color: colors.text,
                        fontSize: moderateScale(13),
                        marginTop: verticalScale(8),
                      }}
                    >
                      {macro.label}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View
            style={{
              marginTop: verticalScale(30),
            }}
          >
            <Text
              className="font-semibold"
              style={{
                color: colors.text,
                fontSize: moderateScale(28),
                letterSpacing: -0.8,
              }}
            >
              Recently uploaded
            </Text>

            <TouchableOpacity activeOpacity={0.85}>
              <View
                style={{
                  marginTop: verticalScale(14),
                  minHeight: verticalScale(118),
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: moderateScale(24),
                  backgroundColor: colors.surface,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: scale(18),
                }}
              >
                <Text
                  className="font-semibold"
                  style={{
                    color: colors.text,
                    fontSize: moderateScale(16),
                    textAlign: "center",
                  }}
                >
                  No meals yet
                </Text>

                <Text
                  style={{
                    color: colors.muted,
                    fontSize: moderateScale(14),
                    lineHeight: moderateScale(20),
                    textAlign: "center",
                    marginTop: verticalScale(6),
                  }}
                >
                  Tap + to add your first meal of the day.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
