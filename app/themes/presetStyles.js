import { StyleSheet } from "react-native";
import colors from "./colors";

export const sizing = (size) => size * 4;

const presetStyles = StyleSheet.create({
	shadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.05,
		shadowRadius: 5,
		elevation: 1,
	},
	listHeader: {
		fontSize: 16,
		fontWeight: "500",
		color: colors().textPrimary,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	marginHorizontal: {
		marginHorizontal: sizing(6),
	},
});

export default presetStyles;
