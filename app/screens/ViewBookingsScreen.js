import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
} from "react-native";
import moment from "moment";
import { Feather, FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

import { axiosInstance } from "../api/config";
import Screen from "../components/Screen";
import ViewBookingListItem from "../components/ViewBookingListItem";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import useAuth from "../auth/useAuth";
import routes from "../navigations/routes";

const historyOptions = [7, 30, 90];

export const TimeSection = ({ data, title, children, navigation }) => (
	<>
		{data.length !== 0 && (
			<Animatable.View animation="fadeInUp" style={styles.section}>
				<View style={presetStyles.row}>
					<Text style={styles.header}>{title}</Text>
					{children}
				</View>
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
							location={
								Boolean(item.resource.title_en)
									? `${item.resource.number} • ${item.resource.title_en}`
									: item.resource.number
							}
							onPress={() =>
								navigation.navigate(
									routes.screens.BOOKING_DETAILS,
									{
										item,
									}
								)
							}
						/>
					</Animatable.View>
				))}
			</Animatable.View>
		)}
	</>
);

function ViewBookingsScreen({ navigation }) {
	const { user } = useAuth();
	const [isLoading, setLoading] = useState(false);
	const [historyOptionsIndex, setHistoryOptionsIndex] = useState(0);
	const [activeBooking, setActiveBooking] = useState(null);
	const [upcoming, setUpcoming] = useState([]);
	const [history, setHistory] = useState([]);

	const fetchUserBookings = () => {
		setLoading(true);
		axiosInstance(
			`/api/users/${user.id}/bookings?start=${moment()
				.subtract(historyOptions[historyOptionsIndex], "days")
				.format("YYYY-MM-DD")}&end=${moment()
				.add(10, "days")
				.format("YYYY-MM-DD")}`
		)
			.then(({ data: bookings }) => {
				// console.log(bookings);
				const current = moment();
				var upcomingData = [];
				var historyData = [];
				bookings.forEach((booking) => {
					if (
						moment().isBetween(booking.start_time, booking.end_time)
					) {
						setActiveBooking(booking);
					} else if (moment(booking.start_time).isAfter(current)) {
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
	}, [historyOptionsIndex]);

	return (
		<Screen>
			<TouchableOpacity
				style={styles.drawerToggle}
				onPress={navigation.toggleDrawer}
			>
				<Feather
					name="menu"
					color={colors.textPrimary}
					size={sizing(5.5)}
				/>
			</TouchableOpacity>
			<Text style={styles.title}>My Bookings</Text>
			<ScrollView
				style={styles.container}
				refreshControl={
					<RefreshControl
						refreshing={isLoading}
						onRefresh={fetchUserBookings}
						title="pull to refresh"
					/>
				}
			>
				{!isLoading && (
					<>
						{Boolean(activeBooking) && (
							<Animatable.View
								animation="fadeInUp"
								style={styles.section}
							>
								<Text style={styles.header}>Active</Text>
								<Animatable.View
									animation="fadeInUp"
									// delay={100}
									style={styles.bookingListItem}
								>
									<ViewBookingListItem
										active
										bookingData={activeBooking}
										date={moment(
											activeBooking.start_time
										).format("LL")}
										period={`${moment(
											activeBooking.start_time
										).format("H:mm")} - ${moment(
											activeBooking.end_time
										).format("H:mm")}`}
										location={
											Boolean(
												activeBooking.resource.title_en
											)
												? `${activeBooking.resource.number} • ${activeBooking.resource.title_en}`
												: activeBooking.resource.number
										}
										onPress={() =>
											navigation.navigate(
												routes.screens.BOOKING_DETAILS,
												{
													item: activeBooking,
												}
											)
										}
									/>
								</Animatable.View>
							</Animatable.View>
						)}
						<TimeSection
							data={upcoming}
							title="Upcoming"
							navigation={navigation}
						/>
						<TimeSection
							data={history}
							title="History"
							navigation={navigation}
						>
							<TouchableOpacity
								style={presetStyles.row}
								onPress={() =>
									setHistoryOptionsIndex(
										historyOptionsIndex >=
											historyOptions.length - 1
											? 0
											: historyOptionsIndex + 1
									)
								}
							>
								<FontAwesome
									name="exchange"
									size={sizing(3)}
									color={colors.textSecondary}
								/>
								<Text
									style={{
										marginLeft: sizing(2),
										color: colors.textSecondary,
										fontSize: sizing(3.5),
									}}
								>
									Past {historyOptions[historyOptionsIndex]}{" "}
									days
								</Text>
							</TouchableOpacity>
						</TimeSection>
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
		paddingHorizontal: sizing(6),
	},
	title: {
		fontSize: sizing(8),
		fontWeight: "600",
		color: colors.Oxford_Blue,
		marginVertical: sizing(6),
		paddingHorizontal: sizing(6),
	},
	header: {
		fontSize: sizing(3.5),
		color: colors.textSecondary,
		flex: 1,
	},
	section: {
		marginBottom: sizing(4),
	},
	bookingListItem: {
		marginTop: sizing(3),
	},
});

export default ViewBookingsScreen;
