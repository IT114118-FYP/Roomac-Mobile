import React from "react";
import { View, StyleSheet, Text } from "react-native";
import moment from "moment";

import TimeslotListItem from "../../components/TimeslotListItem";
import presetStyles, { sizing } from "../../themes/presetStyles";
import routes from "../../navigations/routes";
import { useTranslation } from "react-i18next";

function ConfirmBooking({ timeslot, resource, date }) {
	const { t, i18n } = useTranslation([
		routes.screens.CREATE_BOOKING,
		"common",
	]);

	return (
		<View style={styles.container}>
			<Text>{t("confirm_description")}</Text>
			<Text
				style={[
					presetStyles.listHeader,
					{
						marginTop: sizing(4),
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
				timeslot={timeslot}
				location={`${resource.number} • ${
					i18n.language === "en"
						? resource.branch.title_en
						: i18n.language === "hk"
						? resource.branch.title_hk
						: resource.branch.title_cn
				})}`}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default ConfirmBooking;
