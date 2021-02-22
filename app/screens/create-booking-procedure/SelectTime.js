import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import moment from "moment";

import colors from "../../themes/colors";
import presetStyles, { sizing } from "../../themes/presetStyles";
import TimeslotListItem from "../../components/TimeslotListItem";

function SelectTime({ item, timeslot, resource, date }) {
	return (
		<View style={styles.container}>
			{/* <Text style={presetStyles.listHeader}>Selected</Text> */}
			<Text style={[presetStyles.listHeader]}>
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

export default SelectTime;