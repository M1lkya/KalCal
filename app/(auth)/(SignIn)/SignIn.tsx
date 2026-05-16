import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SocialConnections } from "@/components/ui/social-connections";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { useAppTheme } from "@/theme/ThemeContext";
import { useSignIn } from "@clerk/expo";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

type ClerkErrorLike = {
  message?: string;
  errors?: Array<{
    message?: string;
    longMessage?: string;
  }>;
};

function getClerkErrorMessage(error: unknown) {
  const clerkError = error as ClerkErrorLike | null;

  return (
    clerkError?.errors?.[0]?.longMessage ||
    clerkError?.errors?.[0]?.message ||
    clerkError?.message ||
    "Something went wrong. Please try again."
  );
}

export default function SignIn() {
  const router = useRouter();
  const { signIn, fetchStatus } = useSignIn();
  const { colors, themeName } = useAppTheme();

  const primaryButtonTextColor =
    themeName === "dark" ? colors.background : "#FFFFFF";

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [pendingClientTrust, setPendingClientTrust] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  const isLoading = fetchStatus === "fetching";
  const canSignIn =
    emailAddress.trim().length > 0 && password.length > 0 && !isLoading;
  const canVerifyEmail = code.trim().length > 0 && !isLoading;

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

  async function finishSignIn() {
    const { error } = await signIn.finalize({
      navigate: ({ session }) => {
        if (session?.currentTask) {
          console.log(session.currentTask);
          return;
        }

        router.replace("/onboarding");
      },
    });

    if (error) {
      setFormError(getClerkErrorMessage(error));
    }
  }

  async function onSignInPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!canSignIn) return;

    setFormError(null);
    setStatusMessage(null);

    const { error } = await signIn.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (error) {
      setFormError(getClerkErrorMessage(error));
      return;
    }

    if (signIn.status === "complete") {
      await finishSignIn();
      return;
    }

    if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (!emailCodeFactor) {
        setFormError("This sign-in needs another verification method.");
        return;
      }

      const { error: emailCodeError } = await signIn.mfa.sendEmailCode();

      if (emailCodeError) {
        setFormError(getClerkErrorMessage(emailCodeError));
        return;
      }

      setPendingClientTrust(true);
      setStatusMessage("We sent a verification code to your email.");
      return;
    }

    if (signIn.status === "needs_second_factor") {
      setFormError(
        "This account has multi-factor authentication enabled. Add your MFA flow next.",
      );
      return;
    }

    setFormError("Sign-in is not complete yet. Please try again.");
  }

  async function onVerifyEmailPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!canVerifyEmail) return;

    setFormError(null);
    setStatusMessage(null);

    const { error } = await signIn.mfa.verifyEmailCode({
      code: code.trim(),
    });

    if (error) {
      setFormError(getClerkErrorMessage(error));
      return;
    }

    if (signIn.status === "complete") {
      await finishSignIn();
      return;
    }

    setFormError("Verification was accepted, but sign-in is not complete yet.");
  }

  async function onResendCodePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isLoading) return;

    setFormError(null);
    setStatusMessage(null);

    const { error } = await signIn.mfa.sendEmailCode();

    if (error) {
      setFormError(getClerkErrorMessage(error));
      return;
    }

    setStatusMessage("A new verification code was sent.");
  }

  async function onEditEmailPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    await signIn.reset();
    setPendingClientTrust(false);
    setCode("");
    setFormError(null);
    setStatusMessage(null);
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
            Welcome back
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
            Sign in.
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
            Pick up where you left off and get back into your account.
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
            {!pendingClientTrust ? (
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
            ) : null}

            {statusMessage ? (
              <Text
                style={{
                  color: colors.primary,
                  fontSize: moderateScale(13),
                  lineHeight: moderateScale(19),
                  marginBottom: verticalScale(12),
                  paddingHorizontal: scale(5),
                  textAlign: "center",
                }}
              >
                {statusMessage}
              </Text>
            ) : null}

            {formError ? (
              <Text
                style={{
                  color: "#EF4444",
                  fontSize: moderateScale(13),
                  lineHeight: moderateScale(19),
                  marginBottom: verticalScale(12),
                  paddingHorizontal: scale(5),
                  textAlign: "center",
                }}
              >
                {formError}
              </Text>
            ) : null}

            {!pendingClientTrust ? (
              <>
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
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    placeholder="Email address"
                  />

                  <Input
                    style={{
                      height: verticalScale(46),
                      fontSize: moderateScale(15),
                      marginBottom: verticalScale(10),
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
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                  />
                </View>

                <View
                  className="items-end"
                  style={{ paddingHorizontal: scale(5) }}
                >
                  <Text
                    className="font-medium"
                    style={{
                      color: colors.primary,
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
                    marginTop: verticalScale(20),
                  }}
                >
                  <Button
                    disabled={!canSignIn}
                    onPress={onSignInPress}
                    style={{
                      height: verticalScale(46),
                      backgroundColor: colors.primary,
                      borderRadius: moderateScale(16),
                      opacity: canSignIn ? 1 : 0.6,
                    }}
                  >
                    <Text
                      className="font-semibold"
                      style={{
                        color: primaryButtonTextColor,
                        fontSize: moderateScale(15),
                      }}
                    >
                      {isLoading ? "Signing in..." : "Sign in"}
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
                      New here?{" "}
                    </Text>

                    <Text
                      className="font-semibold"
                      style={{
                        color: colors.primary,
                        fontSize: moderateScale(14),
                      }}
                      onPress={onSignUpPress}
                    >
                      Create an account
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <View style={{ paddingHorizontal: scale(5) }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: moderateScale(20),
                    fontWeight: "700",
                    marginBottom: verticalScale(8),
                    textAlign: "center",
                  }}
                >
                  Check your email
                </Text>

                <Text
                  style={{
                    color: colors.muted,
                    fontSize: moderateScale(14),
                    lineHeight: moderateScale(20),
                    marginBottom: verticalScale(18),
                    textAlign: "center",
                  }}
                >
                  Enter the code sent to {emailAddress.trim()}.
                </Text>

                <Input
                  style={{
                    height: verticalScale(46),
                    fontSize: moderateScale(15),
                    marginBottom: verticalScale(14),
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                    borderRadius: moderateScale(16),
                    textAlign: "center",
                  }}
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoComplete="one-time-code"
                  value={code}
                  onChangeText={setCode}
                  placeholder="Verification code"
                />

                <Button
                  disabled={!canVerifyEmail}
                  onPress={onVerifyEmailPress}
                  style={{
                    height: verticalScale(46),
                    backgroundColor: colors.primary,
                    borderRadius: moderateScale(16),
                    opacity: canVerifyEmail ? 1 : 0.6,
                  }}
                >
                  <Text
                    className="font-semibold"
                    style={{
                      color: primaryButtonTextColor,
                      fontSize: moderateScale(15),
                    }}
                  >
                    {isLoading ? "Verifying..." : "Verify email"}
                  </Text>
                </Button>

                <View
                  className="flex-row justify-center items-center"
                  style={{ marginTop: verticalScale(18) }}
                >
                  <Text
                    className="font-semibold"
                    style={{
                      color: colors.primary,
                      fontSize: moderateScale(14),
                    }}
                    onPress={onResendCodePress}
                  >
                    Resend code
                  </Text>

                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: moderateScale(14),
                    }}
                  >
                    {"  •  "}
                  </Text>

                  <Text
                    className="font-semibold"
                    style={{
                      color: colors.primary,
                      fontSize: moderateScale(14),
                    }}
                    onPress={onEditEmailPress}
                  >
                    Edit email
                  </Text>
                </View>
              </View>
            )}
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
            By signing in or creating an account, you agree to our{" "}
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
