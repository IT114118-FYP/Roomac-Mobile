import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";

function ViewBookingListItem({ bookingData, date, period }) {
	return (
		<View
			style={[
				presetStyles.shadow,
				{
					padding: sizing(3),
					backgroundColor: colors.backgroundPrimary,
					borderRadius: sizing(2),
					marginTop: sizing(2),
				},
			]}
		>
			<Text style={styles.date}>{date}</Text>
			<Text style={styles.period}>{period}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default ViewBookingListItem;
