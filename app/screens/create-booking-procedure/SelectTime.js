import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	Button,
	Alert,
	TouchableOpacity,
	Modal,
	FlatList,
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
	branch,
	date,
	addNewSection,
	removeSection,
	dataSet,
	replaceSection,
}) {
	const [isSelectTimeOpen, setSelectTimeOpen] = useState(false);
	const { t, i18n } = useTranslation([
		routes.screens.CREATE_BOOKING,
		"common",
	]);

	const getNextSection = () => {
		const timeslotsInDate = dataSet.find((data) => data.date === date);
		// console.log("getNextSection==========================");
		// console.log(dataSet);
		// console.log(timeslotsInDate);
		// console.log(timeslot);
		// console.log(date);
		// console.log(
		// 	timeslotsInDate.timeslot[
		// 		timeslotsInDate.timeslot.find(
		// 			(time) => time.start === timeslot[timeslot.length - 1].start
		// 		).id
		// 	]
		// );
		return (
			timeslotsInDate.timeslot[timeslotsInDate.timeslot.length - 1]
				.end !== timeslot[timeslot.length - 1].end &&
			timeslotsInDate.timeslot[
				timeslotsInDate.timeslot.find(
					(time) => time.start === timeslot[timeslot.length - 1].start
				).id
			]
		);
	};

	return (
		<ScrollView style={styles.container}>
			<Text style={[presetStyles.listHeader]}>
				{moment(date, "YYYY-MM-DD").calendar({
					sameDay: t("common:timeslot_sameDay"),
					nextDay: t("common:timeslot_nextDay"),
					nextWeek: "D/M",
					sameElse: "D/M",
				})}
			</Text>
			{timeslot.map((item, index) => (
				<Animatable.View key={index} animation="fadeInRight">
					<TimeslotListItem
						deletable={timeslot.length > 1 && index != 0}
						onPress={() =>
							timeslot.length > 1 &&
							Alert.alert(
								t("deleteTime"),
								t("deleteTimeDescription", {
									value1: `${moment(
										item.start,
										"HH:mm:ss"
									).format("H:mm")} - ${moment(
										item.end,
										"HH:mm:ss"
									).format("H:mm")}`,
									value2: moment(item.end, "HH:mm:ss").format(
										"H:mm"
									),
								}),
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
							{
								en: branch.title_en,
								hk: branch.title_hk,
								cn: branch.title_cn,
							}[i18n.language]
						}`}
					/>
				</Animatable.View>
			))}
			<View
				style={[presetStyles.row, { justifyContent: "space-between" }]}
			>
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
				{timeslot.length == 1 && (
					<TouchableOpacity
						style={[presetStyles.row, { marginTop: sizing(4) }]}
						onPress={() => setSelectTimeOpen(true)}
					>
						<MaterialCommunityIcons
							name="calendar"
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
							{t("changeTime")}
						</Text>
					</TouchableOpacity>
				)}
			</View>
			<Modal
				visible={isSelectTimeOpen}
				animationType="slide"
				presentationStyle="pageSheet"
			>
				<View
					style={{
						padding: sizing(4),
						// paddingBottom: 0,
					}}
				>
					<TouchableOpacity onPress={() => setSelectTimeOpen(false)}>
						<MaterialCommunityIcons
							name="close"
							size={24}
							color={colors.textSecondary}
						/>
					</TouchableOpacity>
					<FlatList
						data={dataSet}
						keyExtractor={(item) => `${item.date}`}
						renderItem={({ item, index }) => (
							<Animatable.View
								style={styles.wrapper}
								animation={{
									0: {
										opacity: 0,
									},
									1: {
										opacity: 1,
									},
								}}
								delay={index * 150 + 100}
								key={item.id}
							>
								<Timeslot
									// selectable={false}
									data={item}
									onPress={(timeslot) => {
										replaceSection(timeslot, item.date);
										setSelectTimeOpen(false);
									}}
								/>
							</Animatable.View>
						)}
					/>
				</View>
			</Modal>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default SelectTime;
