import React from "react";
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	FlatList,
	TouchableOpacity,
} from "react-native";
import moment from "moment";

import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import routes from "../navigations/routes";

const { width } = Dimensions.get("window");

const WIDTH = width * sizing(0.2);

function Timeslot({ data, navigation, onPress }) {
	// console.log(data.date);
	return (
		<View style={styles.wrapper}>
			<Text style={styles.date}>
				{moment(data.date, "YYYY-MM-DD").calendar({
					sameDay: "[Today]",
					nextDay: "[Tomorrow]",
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
						<TouchableOpacity
							style={[
								styles.timeslot,
								item.available
									? styles.available
									: styles.unavailable,
							]}
							key={item.id}
							onPress={() => onPress(item)}
							disabled={!item.available}
						>
							<Text style={styles.timeslotTitle}>
								{moment(item.start, "HH:mm:ss").format("H:mm")}
							</Text>
						</TouchableOpacity>
					)}
				/>
			</View>
		</View>
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
