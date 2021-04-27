import React from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	useColorScheme,
} from "react-native";
import colors from "../themes/colors";
import { sizing } from "../themes/presetStyles";

function Button({ title, onPress, style, titleStyle, children, disabled }) {
	const colorScheme = useColorScheme();

	const styles = StyleSheet.create({
		container: {
			backgroundColor: colors(colorScheme).primary,
			justifyContent: "center",
			alignItems: "center",
			padding: sizing(4),
			borderRadius: sizing(2),
		},
		title: {
			fontSize: sizing(4),
			fontWeight: "600",
			color: colors(colorScheme).textPrimary,
		},
	});

	return (
		<TouchableOpacity
			style={[
				styles.container,
				style,
				disabled && {
					backgroundColor: colors(colorScheme).textSecondary,
				},
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

export default Button;
