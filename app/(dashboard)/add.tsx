import { Input } from "@/components/ui/input";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { useAppTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import {
    Barcode,
    ChevronLeft,
    Heart,
    Plus,
    Search,
    Utensils,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const actionButtons = [
  {
    label: "Barcode",
    icon: Barcode,
  },
  {
    label: "Quick Add",
    icon: Plus,
  },
  {
    label: "My Meals",
    icon: Utensils,
  },
  {
    label: "Favorites",
    icon: Heart,
  },
];

const AddFood = () => {
  const { colors } = useAppTheme();

  const [search, setSearch] = React.useState("");

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: verticalScale(28),
        }}
      >
        <View
          style={{
            flex: 1,
            marginHorizontal: scale(18),
          }}
        >
          <View
            className="flex-row items-center justify-between"
            style={{
              marginTop: verticalScale(8),
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={{
                width: scale(44),
                height: scale(44),
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                shadowColor: colors.text,
                shadowOpacity: 0.04,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 2,
              }}
            >
              <ChevronLeft size={moderateScale(22)} color={colors.text} />
            </Pressable>

            <ThemeSwitcher />
          </View>

          <View
            style={{
              marginTop: verticalScale(28),
            }}
          >
            <View
              style={{
                position: "relative",
                justifyContent: "center",
              }}
            >
              <Search
                size={moderateScale(19)}
                color={colors.muted}
                style={{
                  position: "absolute",
                  left: scale(15),
                  zIndex: 2,
                }}
              />

              <Input
                value={search}
                onChangeText={setSearch}
                placeholder="Search foods"
                placeholderTextColor={colors.muted}
                style={{
                  height: verticalScale(52),
                  paddingLeft: scale(44),
                  fontSize: moderateScale(15),
                  color: colors.text,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: moderateScale(18),
                }}
              />
            </View>

            <View
              className="flex-row"
              style={{
                marginTop: verticalScale(14),
                gap: scale(8),
              }}
            >
              {actionButtons.map((item) => {
                const Icon = item.icon;

                return (
                  <Pressable
                    key={item.label}
                    style={{
                      flex: 1,
                      minHeight: verticalScale(72),
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: moderateScale(18),
                      paddingHorizontal: scale(4),
                    }}
                  >
                    <Icon size={moderateScale(20)} color={colors.primary} />

                    <Text
                      className="font-semibold"
                      style={{
                        marginTop: verticalScale(7),
                        color: colors.text,
                        fontSize: moderateScale(11),
                        textAlign: "center",
                      }}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              marginTop: verticalScale(24),
            }}
          />

          <View
            className="items-center justify-center"
            style={{
              minHeight: verticalScale(330),
              paddingHorizontal: scale(20),
            }}
          >
            <Search
              size={moderateScale(30)}
              color={colors.muted}
              style={{
                marginBottom: verticalScale(14),
              }}
            />

            <Text
              className="font-semibold"
              style={{
                color: colors.text,
                fontSize: moderateScale(18),
                textAlign: "center",
              }}
            >
              Please start by searching something
            </Text>

            <Text
              style={{
                color: colors.muted,
                fontSize: moderateScale(14),
                lineHeight: moderateScale(20),
                textAlign: "center",
                marginTop: verticalScale(8),
              }}
            >
              Search results will appear here.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddFood;
