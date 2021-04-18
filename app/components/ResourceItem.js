import React from "react";
import {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";

import presetStyles, { sizing } from "../themes/presetStyles";
import colors from "../themes/colors";

import { useTranslation } from "react-i18next";

const { height } = Dimensions.get("window");

function ResourceItem({ item, onPress, dense }) {
	const { i18n } = useTranslation();

	return (
		<TouchableOpacity
			style={[styles.container, presetStyles.shadow]}
			onPress={onPress}
			activeOpacity={0.75}
		>
			<View style={dense && presetStyles.row}>
				<Image
					source={{
						uri: item.image_url,
					}}
					style={dense ? styles.denseImage : styles.image}
				/>
				<View style={styles.infoContainer}>
					<Text
						style={{
							color: colors.textSecondary,
							fontSize: sizing(3),
							fontWeight: "500",
						}}
					>
						{
							{
								en: item.branch.title_en,
								hk: item.branch.title_hk,
								cn: item.branch.title_cn,
							}[i18n.language]
						}
					</Text>
					<Text style={styles.title}>{`${item.number} ${
						{
							en: item.title_en,
							hk: item.title_hk,
							cn: item.title_cn,
						}[i18n.language]
					}`}</Text>

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
						<MaterialCommunityIcons
							name="clock"
							size={sizing(4)}
							color={colors.textSecondary}
						/>
						<Text style={styles.descriptionTitle}>
							{moment(item.opening_time, "HH:mm:ss").format(
								"H:mm"
							)}{" "}
							-{" "}
							{moment(item.closing_time, "HH:mm:ss").format(
								"H:mm"
							)}
						</Text>
					</View>
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
	denseImage: {
		height: sizing(23),
		width: sizing(23),
		borderRadius: sizing(4),
		resizeMode: "cover",
	},
	image: {
		height: height / 5,
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
		marginVertical: sizing(1),
	},
	descriptionTitle: {
		color: colors.textSecondary,
		marginLeft: sizing(2),
		fontSize: sizing(3),
	},
});

export default ResourceItem;
