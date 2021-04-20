import React from "react";
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	FlatList,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from "react-native";
import moment from "moment";

import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

const WIDTH = width * sizing(0.2);

function Timeslot({
	data,
	onPress,
	title = "",
	containerWidth = null,
	selectable = true,
}) {
	const { t, i18n } = useTranslation(["common"]);
	return (
		<>
			{selectable ? (
				<View style={styles.wrapper}>
					<Text style={styles.date}>
						{title === ""
							? moment(data.date, "YYYY-MM-DD").calendar({
									sameDay: t("timeslot_sameDay"),
									nextDay: t("timeslot_nextDay"),
									nextWeek: "D/M",
									sameElse: "D/M",
							  })
							: title}
					</Text>
					<View style={[styles.container, presetStyles.shadow]}>
						<FlatList
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
							numColumns={6}
							data={data.timeslot}
							keyExtractor={(item) => `${item.id}`}
							renderItem={({ item, index }) => (
								<TouchableOpacity
									disabled={selectable}
									style={[
										styles.timeslot,
										moment(
											`${data.date} ${item.start}`,
											"YYYY-MM-DD HH:mm:ss"
										).isBefore(moment())
											? styles.past
											: item.available
											? styles.available
											: styles.unavailable,
									]}
									key={item.id}
									onPress={() => onPress(item)}
									disabled={
										!item.available ||
										moment(
											`${data.date} ${item.start}`,
											"YYYY-MM-DD HH:mm:ss"
										).isBefore(moment())
									}
								>
									<Text style={styles.timeslotTitle}>
										{moment(item.start, "HH:mm:ss").format(
											"H:mm"
										)}
									</Text>
								</TouchableOpacity>
							)}
						/>
					</View>
				</View>
			) : (
				<TouchableOpacity
					style={styles.wrapper}
					onPress={() => console.log(data)}
				>
					<Text style={styles.date}>
						{moment(data.date, "YYYY-MM-DD").calendar({
							sameDay: t("timeslot_sameDay"),
							nextDay: t("timeslot_nextDay"),
							nextWeek: "D/M",
							sameElse: "D/M",
						})}
					</Text>
					<View style={[styles.container, presetStyles.shadow]}>
						<FlatList
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
							numColumns={6}
							data={data.timeslot}
							keyExtractor={(item) => `${item.id}`}
							renderItem={({ item, index }) => (
								<View
									style={[
										styles.timeslot,
										moment(
											`${data.date} ${item.start}`,
											"YYYY-MM-DD HH:mm:ss"
										).isBefore(moment())
											? styles.past
											: item.available
											? styles.available
											: styles.unavailable,
									]}
									key={item.id}
								>
									<Text style={styles.timeslotTitle}>
										{moment(item.start, "HH:mm:ss").format(
											"H:mm"
										)}
									</Text>
								</View>
							)}
						/>
					</View>
				</TouchableOpacity>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		marginLeft: sizing(6),
		marginVertical: sizing(4),
	},
	container: {
		paddingVertical: sizing(2),
		backgroundColor: colors.backgroundPrimary,
		// width: "80%",
		width: WIDTH,
		borderRadius: sizing(2),
		alignItems: "center",
	},
	date: {
		fontSize: sizing(3),
		fontWeight: "500",
		marginBottom: sizing(1),
		marginLeft: sizing(2),
	},
	timeslot: {
		width: WIDTH / 6.5,
		paddingVertical: sizing(0.5),
		// marginHorizontal: sizing(0.5),
		margin: sizing(0.25),
		borderRadius: sizing(0.5),
		alignItems: "center",
		justifyContent: "center",
	},
	past: {
		backgroundColor: colors.textSecondary,
	},
	available: {
		backgroundColor: "#32cd80",
	},
	unavailable: {
		backgroundColor: "#d24747",
	},
	timeslotTitle: {
		color: colors.textPrimary,
	},
});

export default Timeslot;
