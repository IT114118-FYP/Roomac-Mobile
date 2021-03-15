import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";

function ViewBookingListItem({ active, date, period, location, onPress }) {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[
				presetStyles.shadow,
				presetStyles.row,
				{
					padding: sizing(3.5),
					borderRadius: sizing(2),
					backgroundColor: active
						? colors.primary
						: colors.backgroundPrimary,
				},
				active && {
					shadowColor: colors.primary,
				},
			]}
		>
			<View style={styles.leftSide}>
				<Text
					style={[
						styles.date,
						active && {
							color: colors.backgroundSecondary,
						},
					]}
				>
					{date}
				</Text>
				<Text
					style={[
						styles.location,
						active && {
							color: colors.backgroundSecondary,
						},
					]}
					numberOfLines={1}
				>
					{location}
				</Text>
			</View>
			<Text
				style={[
					styles.period,
					active && {
						color: colors.backgroundSecondary,
					},
				]}
			>
				{period}
			</Text>
		</TouchableOpacity>
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
