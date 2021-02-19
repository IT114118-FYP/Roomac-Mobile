import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SharedElement } from "react-navigation-shared-element";
import presetStyles from "../themes/presetStyles";

function ResourceItem({ item, onPress }) {
	return (
		<TouchableOpacity
			style={[styles.container, presetStyles.shadow]}
			onPress={onPress}
			activeOpacity={0.75}
		>
			{/* <SharedElement id={`item.${item.id}.image`}> */}
			<Image
				source={{
					uri: item.image_url,
				}}
				style={styles.image}
			/>
			{/* </SharedElement> */}
			<View style={styles.infoContainer}>
				<Text
					style={styles.title}
				>{`${item.number} ${item.title_en}`}</Text>

				<View style={presetStyles.row}>
					<MaterialCommunityIcons
						name="account-multiple"
						size={22}
						color="#c1c1c1"
						style={styles.icon}
					/>
					<Text>{`${item.min_user} - ${item.max_user}`}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		borderRadius: 15,
		marginVertical: 15,
		marginHorizontal: 25,
		padding: 6,
	},
	image: {
		height: 150,
		borderRadius: 15,
		resizeMode: "cover",
	},
	infoContainer: {
		marginVertical: 10,
		marginHorizontal: 12,
	},
	number: {
		fontSize: 18,
		fontWeight: "600",
	},
	title: {
		fontSize: 16,
		fontWeight: "500",
		// position: "absolute",
	},
	icon: {
		marginRight: 5,
	},
});

export default ResourceItem;
