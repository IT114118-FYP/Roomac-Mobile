import React from "react";
import { View, StyleSheet, Text } from "react-native";
import moment from "moment";

import TimeslotListItem from "../../components/TimeslotListItem";
import presetStyles, { sizing } from "../../themes/presetStyles";
import { Translations } from "../../i18n";
import routes from "../../navigations/routes";

function ConfirmBooking({ timeslot, resource, date }) {
	return (
		<View style={styles.container}>
			<Text>
				{Translations.getTranslatedString(
					"confirm_description",
					routes.screens.CREATE_BOOKING
				)}
			</Text>
			<Text
				style={[
					presetStyles.listHeader,
					{
						marginTop: sizing(4),
					},
				]}
			>
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

export default ConfirmBooking;
