import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Animated,
} from "react-native";
import { useTranslation } from "react-i18next";

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
	buttonTitle,
	disabled,
	status,
	statusLate,
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
			{Boolean(status) && (
				<Text
					style={[
						styles.period,
						{
							color: {
								no: "teal",
								na: "red",
								late: colors.Light_Orange,
							}[statusLate],
							flexDirection: "row-reverse",
							marginTop: sizing(2),
						},
					]}
				>
					{status}
				</Text>
			)}
			{active && (
				<View
					style={{
						flexDirection: "row-reverse",
						marginTop: sizing(2),
					}}
				>
					<TouchableOpacity
						style={
							disabled
								? styles.checkinButtonDisabled
								: styles.checkinButton
						}
						onPress={onCheckIn}
						disabled={disabled}
					>
						<Text
							style={
								disabled
									? styles.checkinText
									: styles.checkinTextDisabled
							}
						>
							{buttonTitle}
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
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
		textAlign: "right",
	},
	checkinButtonDisabled: {
		// borderWidth: 1,
		// borderColor: colors.backgroundPrimary,
		// backgroundColor: colors.backgroundSecondary,
		borderRadius: sizing(2),
		paddingVertical: sizing(1.5),
		paddingHorizontal: sizing(3),
	},
	checkinButton: {
		// borderWidth: 1,
		// borderColor: colors.backgroundPrimary,
		backgroundColor: colors.backgroundSecondary,
		borderRadius: sizing(2),
		paddingVertical: sizing(1.5),
		paddingHorizontal: sizing(3),
	},
	checkinTextDisabled: {
		color: colors.Cyber_Grape,
		fontWeight: "700",
		fontSize: sizing(3.5),
	},
	checkinText: {
		color: colors.backgroundPrimary,
		fontWeight: "700",
		fontSize: sizing(3.5),
	},
});

export default ViewBookingListItem;
