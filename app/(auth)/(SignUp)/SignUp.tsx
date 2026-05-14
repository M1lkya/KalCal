import { router } from "expo-router";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  return (
    <SafeAreaView>
      <Text>This is the SignUp</Text>
      <Pressable className="bg-red-600" onPress={() => router.replace("/home")}>
        <Text>Click here</Text>
      </Pressable>
    </SafeAreaView>
  );
}
