import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";

function ViewBookingListItem({ bookingData, date, period, location }) {
	return (
		<View
			style={[
				presetStyles.shadow,
				presetStyles.row,
				{
					padding: sizing(3),
					backgroundColor: colors.backgroundPrimary,
					borderRadius: sizing(2),
				},
			]}
		>
			<View style={styles.leftSide}>
				<Text style={styles.date}>{date}</Text>
				<Text style={styles.location}>{location}</Text>
			</View>
			<Text style={styles.period}>{period}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
	leftSide: {
		flex: 1,
	},
	date: {
		fontSize: sizing(3),
		color: colors.textSecondary,
	},
	location: {
		fontSize: sizing(4),
		fontWeight: "500",
	},
	period: {
		fontSize: sizing(4),
		fontWeight: "500",
	},
});

export default ViewBookingListItem;
