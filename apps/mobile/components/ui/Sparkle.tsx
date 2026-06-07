import Svg, { Circle, Path } from "react-native-svg";
import { T } from "./tokens";

interface SparkleProps {
  size?: number;
  color?: string;
}

export function Sparkle({ size = 18, color = T.spark }: SparkleProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2 L13.6 9.4 L21 11 L13.6 12.6 L12 20 L10.4 12.6 L3 11 L10.4 9.4 Z"
        fill={color}
      />
      <Circle cx="20" cy="4" r="1.4" fill={color} />
      <Circle cx="4" cy="20" r="1" fill={color} />
    </Svg>
  );
}
