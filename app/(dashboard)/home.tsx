import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="items-center">
      <Text>Hi this is the dashboard</Text>
      <Button className="bg-black">
        <Text className="text-white">Click me!!</Text>
      </Button>
    </SafeAreaView>
  );
}
