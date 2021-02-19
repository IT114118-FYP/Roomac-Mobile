import { DefaultTheme } from "@react-navigation/native";
import colors from "./colors";

const navigationTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: colors.backgroundSecondary,
	},
};

export default navigationTheme;
