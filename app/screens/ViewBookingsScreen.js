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
import useAuth from "../auth/useAuth";

const TimeSection = ({ data, title }) => (
	<Animatable.View animation="fadeInUp" style={styles.section}>
		<Text style={styles.header}>{title}</Text>
		{data.map((item, index) => (
			<Animatable.View
				animation="fadeInUp"
				delay={index * 100}
				key={item.id}
				style={styles.bookingListItem}
			>
				<ViewBookingListItem
					bookingData={item}
					date={moment(item.start_time).format("LL")}
					period={`${moment(item.start_time).format(
						"H:mm"
					)} - ${moment(item.end_time).format("H:mm")}`}
					location={item.resource.title_en}
				/>
			</Animatable.View>
		))}
	</Animatable.View>
);

function ViewBookingsScreen({ navigation }) {
	const { user } = useAuth();
	const [isLoading, setLoading] = useState(false);
	const [upcoming, setUpcoming] = useState([]);
	const [history, setHistory] = useState([]);

	const fetchUserBookings = () => {
		setLoading(true);
		axiosInstance(
			`/api/users/${user.id}/bookings?start=2021-02-25&end=2021-02-30`
		)
			.then(({ data: bookings }) => {
				// console.log(bookings);
				const current = moment();
				var upcomingData = [];
				var historyData = [];
				bookings.forEach((booking) => {
					if (moment(booking.start_time).isAfter(current)) {
						upcomingData.push(booking);
					} else {
						historyData.push(booking);
					}
				});
				upcomingData.sort((a, b) =>
					moment(a.start_time).isAfter(moment(b.start_time))
				);
				historyData.sort((a, b) =>
					moment(a.start_time).isBefore(moment(b.start_time))
				);
				setUpcoming(upcomingData);
				setHistory(historyData);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
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
				{!isLoading && (
					<>
						<TimeSection data={upcoming} title="Upcoming" />
						<TimeSection data={history} title="History" />
					</>
				)}
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
	section: {
		marginBottom: sizing(4),
	},
	bookingListItem: {
		marginTop: sizing(3),
	},
});

export default ViewBookingsScreen;
