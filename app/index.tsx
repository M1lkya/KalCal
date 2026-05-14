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
      router.replace("/home");
    } else {
      router.replace("/SignUp");
    }
  }, [isLoaded, isSignedIn]);

  return null;
}
