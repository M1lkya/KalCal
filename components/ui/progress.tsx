import * as ProgressPrimitive from "@rn-primitives/progress";
import * as React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  value?: number | null;
  style?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
};

function Progress({
  value = 0,
  style,
  indicatorStyle,
  ...props
}: ProgressProps) {
  const safeValue = Math.max(0, Math.min(value ?? 0, 100));

  return (
    <ProgressPrimitive.Root
      value={safeValue}
      {...props}
      style={[
        {
          height: verticalScale(10),
          width: "100%",
          backgroundColor: "#E5E7EB",
          borderRadius: moderateScale(999),
          overflow: "hidden",
        },
        style,
      ]}
    >
      <ProgressPrimitive.Indicator asChild>
        <React.Fragment>
          <ProgressBarFill
            safeValue={safeValue}
            indicatorStyle={indicatorStyle}
          />
        </React.Fragment>
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
}

function ProgressBarFill({
  safeValue,
  indicatorStyle,
}: {
  safeValue: number;
  indicatorStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <ProgressPrimitive.Indicator
      style={[
        {
          height: "100%",
          width: `${safeValue}%`,
          backgroundColor: "#2563EB",
          borderRadius: moderateScale(999),
        },
        indicatorStyle,
      ]}
    />
  );
}

export { Progress };
