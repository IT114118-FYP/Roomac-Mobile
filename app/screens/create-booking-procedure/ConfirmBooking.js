import React from "react";
import { View, StyleSheet, Text, useColorScheme } from "react-native";
import moment from "moment";

import TimeslotListItem from "../../components/TimeslotListItem";
import presetStyles, { sizing } from "../../themes/presetStyles";
import routes from "../../navigations/routes";
import { useTranslation } from "react-i18next";
import colors from "../../themes/colors";

function ConfirmBooking({ timeslot, resource, date, branch }) {
	const { t, i18n } = useTranslation([
		routes.screens.CREATE_BOOKING,
		"common",
	]);
	const colorScheme = useColorScheme();

	return (
		<View>
			<Text>{t("confirm_description")}</Text>
			<Text
				style={[
					presetStyles.listHeader,
					{
						marginTop: sizing(4),
						color: colors(colorScheme).textPrimary,
					},
				]}
			>
				{moment(date, "YYYY-MM-DD").calendar({
					sameDay: t("common:timeslot_sameDay"),
					nextDay: t("common:timeslot_nextDay"),
					nextWeek: "D/M",
					sameElse: "D/M",
				})}
			</Text>
			<TimeslotListItem
				// timeslot={}
				start={timeslot[0].start}
				end={timeslot[timeslot.length - 1].end}
				location={`${resource.number} • ${
					{
						en: branch.title_en,
						hk: branch.title_hk,
						cn: branch.title_cn,
					}[i18n.language]
				}`}
			/>
		</View>
	);
}

export default ConfirmBooking;
