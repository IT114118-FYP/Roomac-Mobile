import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from "react-native";
import { axiosInstance } from "../api/config";
import Screen from "../components/Screen";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";

function ViewBookingsScreen(props) {
	const { user } = useAuth();
	const [bookings, setBookings] = useState([]);

	const fetchUserBookings = () => {
		axiosInstance(
			`/api/users/${user.id}/bookings?start=2021-01-24&end=2021-02-30`
		)
			.then(({ data }) => {
				setBookings(data);
				console.log(data);
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		fetchUserBookings();
	}, []);

	return (
		<Screen style={styles.container}>
			<ScrollView style={presetStyles.marginHorizontal}>
				<Text style={styles.title}>My Bookings</Text>
				<View>
					<Text style={styles.header}>Upcoming</Text>
				</View>
			</ScrollView>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {},
	title: {
		fontSize: sizing(8),
		fontWeight: "600",
		color: colors.Oxford_Blue,
		marginTop: sizing(12),
		marginBottom: sizing(8),
	},
	header: {
		fontSize: sizing(3.5),
		color: colors.textSecondary,
	},
});

export default ViewBookingsScreen;
