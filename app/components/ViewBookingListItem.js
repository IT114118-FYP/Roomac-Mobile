import React from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import routes from "../navigations/routes";

import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";

function ViewBookingListItem({
	active,
	date,
	period,
	location,
	onPress,
	onCheckIn,
}) {
	const { t, i18n } = useTranslation([routes.screens.VIEW_BOOKINGS]);
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[
				presetStyles.shadow,
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
			<View style={[presetStyles.row]}>
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
			</View>
			{active && (
				<View
					style={{
						flexDirection: "row-reverse",
						marginTop: sizing(2),
					}}
				>
					<TouchableOpacity
						style={styles.checkinButton}
						onPress={onCheckIn}
					>
						<Text style={styles.checkinText}>{t("checkIn")}</Text>
					</TouchableOpacity>
				</View>
			)}
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
		marginBottom: sizing(1),
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
	checkinButton: {
		borderWidth: 1,
		borderColor: colors.backgroundPrimary,
		backgroundColor: colors.backgroundSecondary,
		borderRadius: sizing(2),
		paddingVertical: sizing(1.5),
		paddingHorizontal: sizing(3),
	},
	checkinText: {
		color: colors.Cyber_Grape,
		fontWeight: "700",
		fontSize: sizing(3.5),
	},
});

export default ViewBookingListItem;
