import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import moment from "moment";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

import { axiosInstance } from "../api/config";
import Screen from "../components/Screen";
import ViewBookingListItem from "../components/ViewBookingListItem";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";

function ViewBookingsScreen({ navigation }) {
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
		<Screen>
			<ScrollView style={styles.container}>
				<TouchableOpacity
					style={styles.drawerToggle}
					onPress={navigation.toggleDrawer}
					style={styles.drawerToggle}
				>
					<Feather
						name="menu"
						color={colors.textPrimary}
						size={sizing(5.5)}
					/>
				</TouchableOpacity>
				<Text style={styles.title}>My Bookings</Text>
				<View>
					<Text style={styles.header}>Upcoming</Text>
					{bookings.map((item, index) => (
						<Animatable.View
							animation="fadeInUp"
							delay={index * 100 + 100}
							key={item.id}
						>
							<ViewBookingListItem
								bookingData={item}
								date={moment(item.start_time).format("LL")}
								period={`${moment(item.start_time).format(
									"H:mm"
								)} - ${moment(item.end_time).format("H:mm")}`}
							/>
						</Animatable.View>
					))}
				</View>
			</ScrollView>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: sizing(6),
	},
	drawerToggle: {
		marginTop: sizing(5),
	},
	title: {
		fontSize: sizing(8),
		fontWeight: "600",
		color: colors.Oxford_Blue,
		marginVertical: sizing(6),
	},
	header: {
		fontSize: sizing(3.5),
		color: colors.textSecondary,
	},
});

export default ViewBookingsScreen;
