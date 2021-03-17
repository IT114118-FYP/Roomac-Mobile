import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import moment from "moment";

import colors from "../../themes/colors";
import presetStyles, { sizing } from "../../themes/presetStyles";
import TimeslotListItem from "../../components/TimeslotListItem";
import { Translations } from "../../i18n";

function SelectTime({ item, timeslot, resource, date }) {
	return (
		<View style={styles.container}>
			{/* <Text style={presetStyles.listHeader}>Selected</Text> */}
			<Text style={[presetStyles.listHeader]}>
				{moment(date, "YYYY-MM-DD").calendar({
					sameDay: Translations.getTranslatedString(
						"timeslot_sameDay",
						"common"
					),
					nextDay: Translations.getTranslatedString(
						"timeslot_nextDay",
						"common"
					),
					nextWeek: "D/M",
					sameElse: "D/M",
				})}
			</Text>
			<TimeslotListItem
				timeslot={timeslot}
				location={`${
					resource.number
				} • ${Translations.getTranslatedStringFromProvider({
					en: resource.branch.title_en,
					hk: resource.branch.title_hk,
					cn: resource.branch.title_cn,
				})}`}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default SelectTime;
