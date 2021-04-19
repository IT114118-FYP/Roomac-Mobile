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
import { useTranslation } from "react-i18next";
import Button from "../components/Button";

const historyOptions = [7, 30, 90];

export const TimeSection = ({ data, title, children, navigation, t, i18n }) => (
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
							status={
								item.checkin_time != null
									? t(
											moment(item.checkin_time).isAfter(
												moment(item.start_time).add(
													15,
													"minutes"
												)
											)
												? "common:late"
												: "common:checkedIn",
											{
												value: moment(
													item.checkin_time
												).format("HH:mm"),
											}
									  )
									: t("common:notCheckIn")
							}
							statusLate={
								item.checkin_time == null
									? "na"
									: moment(item.checkin_time).isAfter(
											moment(item.start_time).add(15, "m")
									  )
									? "late"
									: "no"
							}
							location={
								Boolean(item.resource.title_en)
									? `${item.resource.number} • ${
											{
												en: item.resource.title_en,
												hk: item.resource.title_hk,
												cn: item.resource.title_cn,
											}[i18n.language]
									  }`
									: item.resource.number
							}
							onPress={() =>
								navigation.navigate(
									routes.screens.BOOKING_DETAILS,
									{
										item,
										checkInClicked: false,
									}
								)
							}
							disabled={item.checkin_time == null ? false : true}
						/>
					</Animatable.View>
				))}
			</Animatable.View>
		)}
	</>
);

function ViewBookingsScreen({ navigation }) {
	const { t, i18n } = useTranslation([
		routes.screens.VIEW_BOOKINGS,
		"common",
	]);
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

	// useEffect(() => {
	// 	fetchUserBookings();
	// }, [historyOptionsIndex]);

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			// The screen is focused
			// Call any action
			fetchUserBookings();
		});

		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe;
	}, [navigation, historyOptionsIndex]);

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
			<Text style={styles.title}>{t("myBookings")}</Text>
			<ScrollView
				style={styles.container}
				refreshControl={
					<RefreshControl
						refreshing={isLoading}
						onRefresh={fetchUserBookings}
						title={t("common:pullToRefresh")}
					/>
				}
			>
				{!isLoading && (
					<>
						{Boolean(activeBooking) ? (
							<Animatable.View
								animation="fadeInUp"
								style={styles.section}
							>
								<Text style={styles.header}>{t("active")}</Text>
								<Animatable.View
									animation="fadeInUp"
									style={styles.bookingListItem}
								>
									<ViewBookingListItem
										active
										bookingData={activeBooking}
										date={moment(
											activeBooking.start_time
										).format(
											{
												en: "LL",
												hk: "YYYY年MM月DD日",
												cn: "YYYY年MM月DD日",
											}[i18n.language]
										)}
										period={`${moment(
											activeBooking.start_time
										).format("H:mm")} - ${moment(
											activeBooking.end_time
										).format("H:mm")}`}
										location={
											Boolean(
												activeBooking.resource.title_en
											)
												? `${
														activeBooking.resource
															.number
												  } • ${
														{
															en:
																activeBooking
																	.resource
																	.title_en,
															hk:
																activeBooking
																	.resource
																	.title_hk,
															cn:
																activeBooking
																	.resource
																	.title_cn,
														}[i18n.language]
												  }`
												: activeBooking.resource.number
										}
										onPress={() =>
											navigation.navigate(
												routes.screens.BOOKING_DETAILS,
												{
													item: activeBooking,
													checkInClicked: false,
												}
											)
										}
										buttonTitle={
											activeBooking.checkin_time == null
												? moment().isAfter(
														moment(
															activeBooking.start_time
														).add(15, "m")
												  )
													? t("common:lateCheckIn", {
															value: moment().diff(
																moment(
																	activeBooking.start_time
																),
																"m"
															),
													  })
													: t("checkIn")
												: t(
														moment().isAfter(
															moment(
																activeBooking.start_time
															).add(15, "m")
														)
															? "common:late"
															: "common:checkedIn",
														{
															value: moment(
																activeBooking.checkin_time
															).format("HH:mm"),
														}
												  )
										}
										disabled={
											activeBooking.checkin_time == null
												? false
												: true
										}
										onCheckIn={() =>
											navigation.navigate(
												routes.screens.BOOKING_DETAILS,
												{
													item: activeBooking,
													checkInClicked: true,
												}
											)
										}
									/>
								</Animatable.View>
							</Animatable.View>
						) : (
							<View
								style={{
									alignItems: "center",
									paddingVertical: sizing(4),
								}}
							>
								<Text
									style={{
										color: colors.textSecondary,
									}}
								>
									{t("noBookings")}
								</Text>
								<Button
									title={t("browse")}
									style={{
										backgroundColor: colors.Cyber_Grape,
										paddingVertical: sizing(2),
										marginVertical: sizing(4),
									}}
									onPress={() => {
										navigation.navigate(
											routes.screens.HOME
										);
									}}
								/>
							</View>
						)}
						<TimeSection
							data={upcoming}
							title={t("upcoming")}
							navigation={navigation}
							t={t}
							i18n={i18n}
						/>
						<TimeSection
							data={history}
							title={t("history")}
							navigation={navigation}
							t={t}
							i18n={i18n}
							checkInButton={true}
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
									{t("pastDays", {
										value:
											historyOptions[historyOptionsIndex],
									})}
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
