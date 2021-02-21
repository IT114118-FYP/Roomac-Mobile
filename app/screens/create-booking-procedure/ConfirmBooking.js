import React from "react";
import { View, StyleSheet, Text } from "react-native";
import moment from "moment";

import TimeslotListItem from "../../components/TimeslotListItem";
import presetStyles, { sizing } from "../../themes/presetStyles";

function ConfirmBooking({ timeslot, resource, date }) {
	return (
		<View style={styles.container}>
			<Text>Please check and confirm the following booking</Text>
			<Text
				style={[
					presetStyles.listHeader,
					{
						marginTop: sizing(4),
					},
				]}
			>
				{moment(date, "YYYY-MM-DD").calendar({
					sameDay: "[Today] - D/M",
					nextDay: "[Tomorrow] - D/M",
					nextWeek: "D/M",
					sameElse: "D/M",
				})}
			</Text>
			<TimeslotListItem
				timeslot={timeslot}
				location={`${resource.number} • ${resource.branch.title_en}`}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default ConfirmBooking;
