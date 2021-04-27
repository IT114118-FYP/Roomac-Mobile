import React from "react";
import { View, StyleSheet, Text, useColorScheme } from "react-native";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";

function AvailabilityIndicator({ color, availability }) {
	const colorScheme = useColorScheme();

	const styles = StyleSheet.create({
		title: {
			color: colors(colorScheme).textSecondary,
			marginLeft: sizing(1.5),
			marginRight: sizing(3),
		},
	});

	return (
		<View style={presetStyles.row}>
			<View
				style={{
					backgroundColor: color,
					height: sizing(3),
					width: sizing(3),
					borderRadius: sizing(1),
				}}
			/>
			<Text style={styles.title}>{availability}</Text>
		</View>
	);
}

export default AvailabilityIndicator;
