// app/index.tsx

import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      console.log("ROOT-index.tsx: user signed in sending to /home");
      router.replace("/home");
    } else {
      console.log("ROOT-index.tsx: user not signed in sending to /SignUp");
      router.replace("/SignUp");
    }
  }, [isLoaded, isSignedIn]);

  return null;
}
