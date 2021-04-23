import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";

function AvailabilityIndicator({ color, availability }) {
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

const styles = StyleSheet.create({
	title: {
		color: colors.textSecondary,
		marginLeft: sizing(1.5),
		marginRight: sizing(3),
	},
});

export default AvailabilityIndicator;
