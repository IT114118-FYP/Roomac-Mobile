import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../themes/colors";
import { sizing } from "../themes/presetStyles";

function Button({ title, onPress, style, titleStyle, children, disabled }) {
	return (
		<TouchableOpacity
			style={[
				styles.container,
				style,
				disabled && { backgroundColor: colors.textSecondary },
			]}
			onPress={onPress}
			disabled={disabled}
		>
			{!children && (
				<Text style={[styles.title, titleStyle]}>{title}</Text>
			)}
			{children}
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
