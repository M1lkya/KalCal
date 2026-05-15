import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COLORS } from "@/theme";
import { useSSO, type StartSSOFlowParams } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { Image, Platform, View, type ImageSourcePropType } from "react-native";

WebBrowser.maybeCompleteAuthSession();

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

  const { startSSOFlow } = useSSO();

  function onSocialLoginPress(strategy: SocialConnectionStrategy) {
    return async () => {
      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl: AuthSession.makeRedirectUri(),
        });

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          return;
        }
      } catch (err) {
        console.error(JSON.stringify(err, null, 2));
      }
    };
  }

  return (
    <View className="flex-row gap-3 w-full">
      {SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
        return (
          <Button
            key={strategy.type}
            variant="outline"
            size="sm"
            className="flex-1 h-12 items-center justify-center"
            style={{
              height: 48,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: COLORS.border,
              backgroundColor: COLORS.surface,
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
