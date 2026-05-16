import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { useAppTheme } from "@/theme/ThemeContext";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const GoalPage = () => {
  const { colors, themeName } = useAppTheme();

  const [progress, setProgress] = React.useState(10);

  const primaryButtonTextColor =
    themeName === "dark" ? colors.background : "#FFFFFF";

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
            What's your goal?
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
            Choose the option that best matches what you want to focus on.
          </Text>
        </View>

        <View
          className="flex-1 items-center justify-center"
          style={{
            gap: verticalScale(12),
          }}
        >
          <Button
            variant="outline"
            style={{
              width: "100%",
              height: verticalScale(58),
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: moderateScale(18),
            }}
          >
            <Text
              className="font-semibold"
              style={{
                color: colors.text,
                fontSize: moderateScale(15),
              }}
            >
              Lose Weight
            </Text>
          </Button>

          <Button
            variant="outline"
            style={{
              width: "100%",
              height: verticalScale(58),
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: moderateScale(18),
            }}
          >
            <Text
              className="font-semibold"
              style={{
                color: colors.text,
                fontSize: moderateScale(15),
              }}
            >
              Maintain Weight
            </Text>
          </Button>

          <Button
            variant="outline"
            style={{
              width: "100%",
              height: verticalScale(58),
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: moderateScale(18),
            }}
          >
            <Text
              className="font-semibold"
              style={{
                color: colors.text,
                fontSize: moderateScale(15),
              }}
            >
              Gain Weight
            </Text>
          </Button>
        </View>

        <View
          style={{
            paddingBottom: verticalScale(16),
          }}
        >
          <Button
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

export default GoalPage;
