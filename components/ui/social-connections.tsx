import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COLORS } from "@/theme";
import { useSSO, type StartSSOFlowParams } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { Image, Platform, View, type ImageSourcePropType } from "react-native";

const SOCIAL_LOGIN_DISABLED = true;
WebBrowser.maybeCompleteAuthSession();

// Change this to the page you want users to land on
// Examples:
// "/home"
// "/dashboard"
// "/(tabs)"
// "/(tabs)/home"
const AFTER_SIGN_IN_ROUTE = "/onboarding";

type SocialConnectionStrategy = Extract<
  StartSSOFlowParams["strategy"],
  "oauth_google" | "oauth_apple"
>;

const SOCIAL_CONNECTION_STRATEGIES: {
  type: SocialConnectionStrategy;
  source: ImageSourcePropType;
  useTint?: boolean;
}[] = [
  {
    type: "oauth_apple",
    source: { uri: "https://img.clerk.com/static/apple.png?width=160" },
    useTint: true,
  },
  {
    type: "oauth_google",
    source: { uri: "https://img.clerk.com/static/google.png?width=160" },
    useTint: false,
  },
];

export function SocialConnections() {
  useWarmUpBrowser();

  const router = useRouter();
  const { startSSOFlow } = useSSO();

  const [loadingStrategy, setLoadingStrategy] =
    React.useState<SocialConnectionStrategy | null>(null);

  function onSocialLoginPress(strategy: SocialConnectionStrategy) {
    return async () => {
      if (SOCIAL_LOGIN_DISABLED) return;
      try {
        setLoadingStrategy(strategy);

        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,

          // This is the OAuth callback URL back into your Expo app.
          // It is NOT the page users see after sign in.
          redirectUrl: AuthSession.makeRedirectUri(),
        });

        if (createdSessionId && setActive) {
          await setActive({
            session: createdSessionId,
          });

          // This is the actual app redirect after sign in / account creation.
          router.replace(AFTER_SIGN_IN_ROUTE);

          return;
        }

        console.warn("No session was created from the SSO flow.");
      } catch (err) {
        console.error("Social login error:", JSON.stringify(err, null, 2));
      } finally {
        setLoadingStrategy(null);
      }
    };
  }

  return (
    <View className="flex-row gap-3 w-full">
      {SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
        const isLoading = loadingStrategy === strategy.type;
        const isDisabled = loadingStrategy !== null;

        return (
          <Button
            key={strategy.type}
            variant="outline"
            size="sm"
            disabled={isDisabled}
            className="flex-1 h-12 items-center justify-center"
            style={{
              height: 48,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: COLORS.border,
              backgroundColor: COLORS.surface,
              opacity: isDisabled && !isLoading ? 0.6 : 1,
              shadowColor: COLORS.text,
              shadowOpacity: 0.04,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 1,
            }}
            onPress={onSocialLoginPress(strategy.type)}
          >
            <Image
              className={cn("size-5")}
              tintColor={Platform.select({
                native: strategy.useTint ? COLORS.text : undefined,
              })}
              source={strategy.source}
            />
          </Button>
        );
      })}
    </View>
  );
}

const useWarmUpBrowser = Platform.select({
  web: () => {},
  default: () => {
    React.useEffect(() => {
      void WebBrowser.warmUpAsync();

      return () => {
        void WebBrowser.coolDownAsync();
      };
    }, []);
  },
});
