import React from "react";
import { View, StyleSheet, Text } from "react-native";
import moment from "moment";
import presetStyles, { sizing } from "../themes/presetStyles";
import colors from "../themes/colors";

export default TimeslotListItem = ({ timeslot, location }) => {
	return (
		<View
			style={[
				presetStyles.shadow,
				presetStyles.row,
				{
					padding: sizing(3),
					backgroundColor: colors.backgroundPrimary,
					borderRadius: sizing(2),
					marginTop: sizing(2),
				},
			]}
		>
			<View
				style={{
					height: sizing(2),
					width: sizing(2),
					borderRadius: sizing(2),
					backgroundColor: moment(
						timeslot.start,
						"HH:mm:ss"
					).isBefore(moment("12:00", "H:mm"), "hour")
						? colors.secondary
						: colors.Light_Orange,
					marginRight: sizing(2),
				}}
			/>
			<Text style={{ flex: 1 }}>
				{moment(timeslot.start, "HH:mm:ss").format("H:mm")} -{" "}
				{moment(timeslot.end, "HH:mm:ss").format("H:mm")}
			</Text>
			<Text
				style={{
					color: colors.textSecondary,
				}}
			>
				{location}
			</Text>
		</View>
	);
};
