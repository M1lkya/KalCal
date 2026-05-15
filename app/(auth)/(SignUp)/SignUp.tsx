import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SocialConnections } from "@/components/ui/social-connections";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { useAppTheme } from "@/theme/ThemeContext";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as React from "react";
import { Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export default function SignUp() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [checked, setChecked] = React.useState(false);

  function onCheckedChange(checked: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setChecked(checked);
  }

  function onSignInPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/SignIn");
  }

  function onTermsPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("..");
  }

  function onPrivacyPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("..");
  }

  return (
    <SafeAreaView
      className="h-full"
      style={{ backgroundColor: colors.background }}
    >
      <View
        className="h-full"
        style={{
          marginTop: verticalScale(10),
          marginHorizontal: scale(18),
          position: "relative",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <ThemeSwitcher />
        </View>

        <View
          style={{
            paddingRight: scale(56),
            paddingTop: verticalScale(8),
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
            Create account
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
            Start fresh.
          </Text>

          <Text
            style={{
              marginTop: verticalScale(8),
              fontSize: moderateScale(15),
              color: colors.muted,
              lineHeight: moderateScale(22),
              maxWidth: scale(280),
            }}
          >
            Make your account in a few seconds and jump right in.
          </Text>
        </View>

        <View className="flex-1 justify-center">
          <View
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: moderateScale(28),
              paddingVertical: verticalScale(24),
              paddingHorizontal: scale(14),
              shadowColor: colors.text,
              shadowOpacity: 0.04,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 12 },
              elevation: 2,
            }}
          >
            <View
              style={{
                paddingHorizontal: scale(5),
                marginBottom: verticalScale(18),
              }}
            >
              <SocialConnections />

              <View
                className="flex-row items-center"
                style={{ marginTop: verticalScale(18) }}
              >
                <Separator
                  style={{
                    flex: 1,
                    backgroundColor: colors.border,
                  }}
                />

                <Text
                  style={{
                    color: colors.muted,
                    fontSize: moderateScale(12),
                    marginHorizontal: scale(12),
                    fontWeight: "600",
                  }}
                >
                  or continue with email
                </Text>

                <Separator
                  style={{
                    flex: 1,
                    backgroundColor: colors.border,
                  }}
                />
              </View>
            </View>

            <View style={{ paddingHorizontal: scale(5) }}>
              <Input
                style={{
                  height: verticalScale(46),
                  fontSize: moderateScale(15),
                  marginBottom: verticalScale(12),
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                  borderRadius: moderateScale(16),
                }}
                placeholderTextColor={colors.muted}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                placeholder="Email address"
              />

              <Input
                style={{
                  height: verticalScale(46),
                  fontSize: moderateScale(15),
                  marginBottom: verticalScale(14),
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                  borderRadius: moderateScale(16),
                }}
                placeholderTextColor={colors.muted}
                keyboardType="default"
                textContentType="password"
                autoComplete="password"
                secureTextEntry
                placeholder="Password"
              />
            </View>

            <View
              className="flex-row items-center gap-2"
              style={{ paddingHorizontal: scale(5) }}
            >
              <Checkbox
                style={{
                  width: scale(16),
                  height: verticalScale(16),
                  borderColor: checked ? colors.primary : colors.border,
                  backgroundColor: checked ? colors.primary : colors.surface,
                }}
                aria-labelledby="terms-checkbox"
                id="terms-checkbox"
                checked={checked}
                onCheckedChange={onCheckedChange}
              />

              <Label
                style={{
                  flex: 1,
                  fontSize: moderateScale(14),
                  color: colors.muted,
                  lineHeight: moderateScale(20),
                }}
                nativeID="terms-checkbox"
                htmlFor="terms-checkbox"
                onPress={Platform.select({
                  native: () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setChecked((prev) => !prev);
                  },
                })}
              >
                I agree to the terms and conditions
              </Label>
            </View>

            <View
              style={{
                paddingHorizontal: scale(5),
                marginTop: verticalScale(20),
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
                    color: "#FFFFFF",
                    fontSize: moderateScale(15),
                  }}
                >
                  Create account
                </Text>
              </Button>

              <View
                className="flex-row justify-center items-center"
                style={{ marginTop: verticalScale(18) }}
              >
                <Text
                  style={{
                    color: colors.muted,
                    fontSize: moderateScale(14),
                  }}
                >
                  Already have an account?{" "}
                </Text>

                <Text
                  className="font-semibold"
                  style={{
                    color: colors.primary,
                    fontSize: moderateScale(14),
                  }}
                  onPress={onSignInPress}
                >
                  Sign in
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: scale(14),
            paddingBottom: verticalScale(16),
          }}
        >
          <Text
            style={{
              color: colors.muted,
              fontSize: moderateScale(12),
              textAlign: "center",
              lineHeight: moderateScale(18),
            }}
          >
            By continuing or creating an account, you agree to our{" "}
            <Text
              className="font-medium"
              style={{ color: colors.primary }}
              onPress={onTermsPress}
            >
              Terms and Conditions
            </Text>{" "}
            and{" "}
            <Text
              className="font-medium"
              style={{ color: colors.primary }}
              onPress={onPrivacyPress}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
