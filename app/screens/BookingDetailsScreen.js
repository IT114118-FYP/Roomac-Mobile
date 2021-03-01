import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Screen from "../components/Screen";

function BookingDetailsScreen({ route }) {
	const { item } = route.params;
	return (
		<Screen style={styles.container}>
			<Text>{item.resource.number}</Text>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default BookingDetailsScreen;
