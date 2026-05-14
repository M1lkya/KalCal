import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function Layout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="home">
        <Label>Home</Label>
        <Icon sf="house.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="progress">
        <label>Progress</label>
        <Icon sf="progress.indicator" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf="gear" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
