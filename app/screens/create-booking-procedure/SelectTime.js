import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	Button,
	Alert,
	TouchableOpacity,
} from "react-native";
import moment from "moment";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../../themes/colors";
import presetStyles, { sizing } from "../../themes/presetStyles";
import TimeslotListItem from "../../components/TimeslotListItem";
import { useTranslation } from "react-i18next";
import routes from "../../navigations/routes";
import Timeslot from "../../components/Timeslot";

function SelectTime({
	item,
	timeslot,
	resource,
	date,
	dateTimeslots,
	addNewSection,
	removeSection,
}) {
	const { t, i18n } = useTranslation([
		routes.screens.CREATE_BOOKING,
		"common",
	]);
	const getNextSection = () =>
		dateTimeslots.timeslot[dateTimeslots.timeslot.length - 1].id !==
			timeslot[timeslot.length - 1].id &&
		dateTimeslots.timeslot.find(
			(time) => time.id === timeslot[timeslot.length - 1].id + 1
		);

	return (
		<ScrollView style={styles.container}>
			{/* <Text style={presetStyles.listHeader}>Selected</Text> */}
			<Text style={[presetStyles.listHeader]}>
				{moment(date, "YYYY-MM-DD").calendar({
					sameDay: t("common:timeslot_sameDay"),
					nextDay: t("common:timeslot_nextDay"),
					nextWeek: "D/M",
					sameElse: "D/M",
				})}
			</Text>
			{timeslot.map((item) => (
				<Animatable.View key={item.id} animation="fadeInRight">
					<TimeslotListItem
						onPress={() =>
							timeslot.length > 1 &&
							Alert.alert(
								t("deleteTime"),
								`${moment(item.start, "HH:mm:ss").format(
									"H:mm"
								)} - ${moment(item.end, "HH:mm:ss").format(
									"H:mm"
								)}`,
								[
									{
										text: t(
											routes.screens.SETTINGS + ":cancel"
										),
										style: "cancel",
									},
									{
										text: t("common:ok"),
										onPress: () => removeSection(item),
									},
								]
							)
						}
						timeslot={item}
						start={item.start}
						end={item.end}
						location={`${resource.number} • ${
							i18n.language === "en"
								? resource.branch.title_en
								: i18n.language === "hk"
								? resource.branch.title_hk
								: resource.branch.title_cn
						}`}
					/>
				</Animatable.View>
			))}
			{getNextSection().available && (
				<TouchableOpacity
					style={[presetStyles.row, { marginTop: sizing(4) }]}
					onPress={() => {
						addNewSection(getNextSection());
					}}
				>
					<MaterialCommunityIcons
						name="plus-circle-outline"
						size={sizing(5)}
						color={colors.primary}
					/>
					<Text
						style={{
							marginLeft: sizing(2),
							color: colors.primary,
							fontSize: sizing(4),
						}}
					>
						{t("extend", {
							value: moment(
								getNextSection().end,
								"HH:mm:ss"
							).format("H:mm"),
						})}
					</Text>
				</TouchableOpacity>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default SelectTime;
