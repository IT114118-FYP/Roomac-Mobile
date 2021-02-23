import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";

import presetStyles, { sizing } from "../themes/presetStyles";
import colors from "../themes/colors";

function ResourceItem({ item, onPress }) {
	return (
		<TouchableOpacity
			style={[styles.container, presetStyles.shadow]}
			onPress={onPress}
			activeOpacity={0.75}
		>
			<Image
				source={{
					uri: item.image_url,
				}}
				style={styles.image}
			/>
			<View style={styles.infoContainer}>
				<Text
					style={styles.title}
				>{`${item.number} ${item.title_en}`}</Text>

				<View style={presetStyles.row}>
					<MaterialCommunityIcons
						name="account-multiple"
						size={sizing(4)}
						color={colors.textSecondary}
					/>
					<Text
						style={styles.descriptionTitle}
					>{`${item.min_user} - ${item.max_user}`}</Text>
				</View>
				<View style={[presetStyles.row, { marginTop: sizing(1) }]}>
					<MaterialIcons
						name="location-on"
						size={sizing(4)}
						color={colors.textSecondary}
					/>
					<Text style={styles.descriptionTitle}>
						{item.branch.title_en}
					</Text>
				</View>
				<View style={[presetStyles.row, { marginTop: sizing(1) }]}>
					<MaterialCommunityIcons
						name="clock"
						size={sizing(4)}
						color={colors.textSecondary}
					/>
					<Text style={styles.descriptionTitle}>
						{moment(item.opening_time, "HH:mm:ss").format("H:mm")} -{" "}
						{moment(item.closing_time, "HH:mm:ss").format("H:mm")}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		borderRadius: sizing(4),
		marginVertical: sizing(4),
		marginHorizontal: sizing(6),
		padding: sizing(1.5),
	},
	image: {
		height: 150,
		borderRadius: sizing(4),
		resizeMode: "cover",
	},
	infoContainer: {
		marginVertical: sizing(2.5),
		marginHorizontal: sizing(3),
	},
	title: {
		fontSize: sizing(4),
		fontWeight: "500",
		marginBottom: sizing(1),
	},
	descriptionTitle: {
		color: colors.textSecondary,
		marginLeft: sizing(2),
		fontSize: sizing(3),
	},
});

export default ResourceItem;
