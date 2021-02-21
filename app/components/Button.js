import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../themes/colors";
import { sizing } from "../themes/presetStyles";

function Button({ title, onPress, style, titleStyle }) {
	return (
		<TouchableOpacity style={[styles.container, style]} onPress={onPress}>
			<Text style={[styles.title, titleStyle]}>{title}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
		borderRadius: sizing(2),
	},
	title: {
		fontSize: sizing(4),
		fontWeight: "600",
		color: colors.backgroundSecondary,
	},
});

export default Button;
