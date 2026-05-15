import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SocialConnections } from "@/components/ui/social-connections";
import { COLORS } from "@/theme";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export default function SignIn() {
  const router = useRouter();

  function onForgotPasswordPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("..");
  }

  function onSignUpPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/SignUp");
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
      style={{ backgroundColor: COLORS.background }}
    >
      <View
        className="h-full"
        style={{
          marginTop: verticalScale(10),
          marginHorizontal: scale(15),
        }}
      >
        <View>
          <Text
            className="font-semibold"
            style={{
              fontSize: moderateScale(45),
              color: COLORS.text,
              letterSpacing: -1.5,
            }}
          >
            Sign In
          </Text>

          <Text
            style={{
              marginTop: verticalScale(6),
              fontSize: moderateScale(15),
              color: COLORS.muted,
            }}
          >
            Welcome back. Log in to continue.
          </Text>
        </View>

        <View className="flex-1 justify-center">
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderColor: COLORS.border,
              borderWidth: 1,
              borderRadius: moderateScale(24),
              paddingVertical: verticalScale(22),
              paddingHorizontal: scale(12),
              shadowColor: COLORS.text,
              shadowOpacity: 0.05,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 8 },
              elevation: 2,
            }}
          >
            <View
              className="items-center"
              style={{
                paddingHorizontal: scale(5),
                marginBottom: verticalScale(10),
              }}
            >
              <SocialConnections />

              <Separator
                style={{
                  marginTop: verticalScale(14),
                  backgroundColor: COLORS.border,
                }}
              />
            </View>

            <View
              className="items-center"
              style={{ paddingHorizontal: scale(5) }}
            >
              <Input
                style={{
                  height: verticalScale(44),
                  fontSize: moderateScale(15),
                  marginBottom: verticalScale(10),
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.border,
                  color: COLORS.text,
                  borderRadius: moderateScale(14),
                }}
                placeholderTextColor={COLORS.muted}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                placeholder="Email"
              />

              <Input
                style={{
                  height: verticalScale(44),
                  fontSize: moderateScale(15),
                  marginBottom: verticalScale(8),
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.border,
                  color: COLORS.text,
                  borderRadius: moderateScale(14),
                }}
                placeholderTextColor={COLORS.muted}
                keyboardType="default"
                textContentType="password"
                autoComplete="password"
                secureTextEntry
                placeholder="Password"
              />
            </View>

            <View className="items-end" style={{ paddingHorizontal: scale(5) }}>
              <Text
                className="font-medium"
                style={{
                  color: COLORS.primary,
                  fontSize: moderateScale(14),
                }}
                onPress={onForgotPasswordPress}
              >
                Forgot password?
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: scale(5),
                marginTop: verticalScale(18),
              }}
            >
              <Button
                style={{
                  height: verticalScale(42),
                  backgroundColor: COLORS.primary,
                  borderRadius: moderateScale(14),
                }}
              >
                <Text
                  className="font-semibold"
                  style={{
                    color: COLORS.surface,
                    fontSize: moderateScale(15),
                  }}
                >
                  Sign In
                </Text>
              </Button>

              <View
                className="flex-row justify-center items-center"
                style={{ marginTop: verticalScale(16) }}
              >
                <Text
                  style={{
                    color: COLORS.muted,
                    fontSize: moderateScale(14),
                  }}
                >
                  Don&apos;t have an account?{" "}
                </Text>

                <Text
                  className="font-semibold"
                  style={{
                    color: COLORS.primary,
                    fontSize: moderateScale(14),
                  }}
                  onPress={onSignUpPress}
                >
                  Sign up
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: scale(18),
            paddingBottom: verticalScale(16),
          }}
        >
          <Text
            style={{
              color: COLORS.muted,
              fontSize: moderateScale(12),
              textAlign: "center",
              lineHeight: moderateScale(18),
            }}
          >
            By signing in or creating an account, you agree to our{" "}
            <Text
              className="font-medium"
              style={{ color: COLORS.primary }}
              onPress={onTermsPress}
            >
              Terms and Conditions
            </Text>{" "}
            and{" "}
            <Text
              className="font-medium"
              style={{ color: COLORS.primary }}
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
