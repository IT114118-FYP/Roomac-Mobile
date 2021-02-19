import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import Screen from "../components/Screen";

function DetailedCategoriesScreen({ route }) {
	const data = route.params;
	return (
		<Screen style={styles.container}>
			<Image
				source={{
					uri: data.image_url,
				}}
				style={styles.image}
			/>
			<Text style={styles.title}>{data.title_en}</Text>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {},
	image: {
		height: 180,
		resizeMode: "cover",
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		margin: 15,
	},
});

export default DetailedCategoriesScreen;
