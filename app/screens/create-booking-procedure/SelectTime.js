import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import moment from "moment";

import colors from "../../themes/colors";
import presetStyles, { sizing } from "../../themes/presetStyles";
import TimeslotListItem from "../../components/TimeslotListItem";
import { useTranslation } from "react-i18next";
import routes from "../../navigations/routes";
import Timeslot from "../../components/Timeslot";

function SelectTime({ item, timeslot, resource, date, dateTimeslots }) {
	const { t, i18n } = useTranslation([
		routes.screens.CREATE_BOOKING,
		"common",
	]);
	return (
		<View style={styles.container}>
			{/* <Text style={presetStyles.listHeader}>Selected</Text> */}
			<Text style={[presetStyles.listHeader]}>
				{moment(date, "YYYY-MM-DD").calendar({
					sameDay: t("common:timeslot_sameDay"),
					nextDay: t("common:timeslot_nextDay"),
					nextWeek: "D/M",
					sameElse: "D/M",
				})}
			</Text>
			{/* {timeslot.map(item => )} */}
			<TimeslotListItem
				timeslot={timeslot[0]}
				location={`${resource.number} • ${
					i18n.language === "en"
						? resource.branch.title_en
						: i18n.language === "hk"
						? resource.branch.title_hk
						: resource.branch.title_cn
				}`}
			/>
			<Timeslot
				data={dateTimeslots}
				title={"Add more sections"}
				onPress={(time) => console.log(time)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default SelectTime;
