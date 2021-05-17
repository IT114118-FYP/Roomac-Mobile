import React, { useRef, useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	Animated,
	ActivityIndicator,
	useColorScheme,
} from "react-native";
import * as Animatable from "react-native-animatable";

import Button from "../components/Button";
import Screen from "../components/Screen";
import ProgressStepper from "../components/ProgressStepper";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import {
	ConfirmBooking,
	SelectTime,
	TermsAndConditions,
	BookingResults,
} from "./create-booking-procedure";
import routes from "../navigations/routes";
import { useTranslation } from "react-i18next";
import bookingsApi from "../api/bookings";
import resourcesApi from "../api/resources";
import moment from "moment";
import axios from "axios";
import branchesApi from "../api/branches";

const { width } = Dimensions.get("window");

function CreateBookingScreen({ route, navigation }) {
	const {
		timeslot: timeslotData,
		item: resource,
		date: dateData,
		bookingId,
		edit = false,
	} = route.params;
	const { t, i18n } = useTranslation([routes.screens.CREATE_BOOKING]);
	const colorScheme = useColorScheme();
	const scrollX = React.useRef(new Animated.Value(0)).current;
	const flatListRef = useRef(null);

	const [timeslot, setTimeslot] = useState([timeslotData]);
	const [date, setDate] = useState(dateData);
	// const [dataSet, setDataSet] = useState(datasetData);
	const [listIndex, setListIndex] = useState(0);
	const [isLoading, setLoading] = useState(true);
	const [isBookingLoading, setBookingLoading] = useState(true);
	const [bookingRef, setBookingRef] = useState("");
	const [isSuccess, setSuccess] = useState(false);
	const [tos, setTos] = useState({});
	const [branch, setBranch] = useState({});
	const [timeslotsinDays, setTimeslotsinDays] = useState([]);

	const inputRange = [
		(listIndex - 1) * width,
		listIndex * width,
		(listIndex + 1) * width,
	];
	const inputRangeOpacity = [
		(listIndex - 0.3) * width,
		listIndex * width,
		(listIndex + 0.3) * width,
	];
	const translateY = scrollX.interpolate({
		inputRange,
		outputRange: [-sizing(8), 0, sizing(8)],
	});
	const opacity = scrollX.interpolate({
		inputRange: inputRangeOpacity,
		outputRange: [0, 1, 0],
	});
	const scrollToIndex = (index) => {
		flatListRef.current.scrollToIndex({ animated: true, index: index });
		setListIndex(index);
	};
	const handleOnMainPress = (i) => {
		switch (i) {
			case 2:
				addBooking();
				scrollToIndex(i + 1);
				break;
			case 3:
				navigation.navigate(routes.navigators.BOOKINGS);
				break;
			default:
				scrollToIndex(i + 1);
				break;
		}
	};
	const procedure = [
		{
			step: 1,
			title: t("selectTime"),
			component: SelectTime,
			preceedButtonText: t("next"),
		},
		{
			step: 2,
			title: t("tos"),
			component: TermsAndConditions,
			preceedButtonText: t("accept"),
		},
		{
			step: 3,
			title: t("confirmBooking"),
			component: ConfirmBooking,
			preceedButtonText: t("submit"),
		},
		{
			step: 4,
			title: "",
			component: BookingResults,
			preceedButtonText: t("viewBookings"),
		},
	];
	const addNewSection = (time) => setTimeslot([...timeslot, time]);
	const removeSection = (time) => {
		const deleteTime = moment(time.start, "HH:mm:ss");
		setTimeslot(
			timeslot.filter((t) =>
				moment(t.start, "HH:mm:ss").isBefore(deleteTime)
			)
		);
		// setTimeslot(timeslot.filter((t) => t.id !== time.id));
	};
	const replaceSection = (item, date) => {
		setTimeslot([item]);
		setDate(date);
	};

	const addBooking = () => {
		setBookingLoading(true);
		console.log(edit);
		if (edit) {
			bookingsApi
				.update(
					bookingId,
					date,
					timeslot[0].start,
					timeslot[timeslot.length - 1].end
				)
				.then((res) => {
					console.log(res);
					setSuccess(true);
				})
				.catch((error) => {
					console.log(error);
					setSuccess(false);
				})
				.finally(() => {
					setBookingLoading(false);
				});
		} else {
			bookingsApi
				.add(
					resource.id,
					date,
					timeslot[0].start,
					timeslot[timeslot.length - 1].end
				)
				.then(({ data }) => {
					setBookingRef(data);
					setSuccess(true);
				})
				.catch((error) => {
					console.log(error);
					setSuccess(false);
				})
				.finally(() => {
					setBookingLoading(false);
				});
		}
	};

	const fetchAll = async () => {
		setLoading(true);
		try {
			const [tos, timeslotsinDays, branches] = await axios.all([
				resourcesApi.fetchTOS(resource.tos_id),
				edit
					? resourcesApi.fetchTimeslotsWithException(
							resource.id,
							moment().format("YYYY-MM-DD"),
							moment().add(10, "days").format("YYYY-MM-DD"),
							bookingId
					  )
					: resourcesApi.fetchTimeslots(
							resource.id,
							moment().format("YYYY-MM-DD"),
							moment().add(10, "days").format("YYYY-MM-DD")
					  ),
				branchesApi.fetchAll(),
			]);
			setTos(tos.data);
			setBranch(
				branches.data.find((branch) => branch.id === resource.branch_id)
			);

			let events = [];
			for (let i in timeslotsinDays.data.allow_times) {
				let allow_time = timeslotsinDays.data.allow_times[i];
				for (let date in allow_time) {
					let times = allow_time[date];
					let eventSlot = [];
					for (let j in times) {
						eventSlot.push({
							id: times[j].id,
							start: times[j].start_time,
							end: times[j].end_time,
							available: times[j].available,
						});
					}
					events.push({
						date: date,
						timeslot: eventSlot,
					});
				}
			}
			console.log(events);
			setTimeslotsinDays(events);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAll();
	}, []);

	const styles = StyleSheet.create({
		container: {
			marginHorizontal: sizing(8),
			marginTop: sizing(12),
		},
		title: {
			fontSize: sizing(8),
			fontWeight: "600",
			color: colors(colorScheme).textPrimary,
			marginBottom: sizing(2),
		},
		next: {
			color: colors(colorScheme).textSecondary,
			fontWeight: "400",
		},
		stepper: {
			marginTop: sizing(4),
		},
		button: {
			paddingVertical: sizing(2),
			paddingHorizontal: sizing(4),
		},
	});

	return (
		<Screen>
			{isLoading ? (
				<View style={styles.container}>
					<ActivityIndicator />
				</View>
			) : (
				<Animatable.View animation="fadeInUp" style={{ flex: 1 }}>
					<View style={styles.container}>
						<Animated.View
							style={{
								opacity,
								transform: [{ translateY }],
							}}
						>
							<Text style={styles.title}>
								{procedure[listIndex].title}
							</Text>
							<Text style={styles.next}>
								{listIndex === 2
									? t("lastStep")
									: listIndex < procedure.length - 1
									? `${t("next")}: ${
											procedure[listIndex + 1].title
									  }`
									: ""}
							</Text>
						</Animated.View>
						<ProgressStepper
							containerStyle={styles.stepper}
							currentStep={listIndex + 1}
							steps={procedure.length}
							height={sizing(2)}
							color={colors(colorScheme).primary}
						/>
					</View>
					<Animated.FlatList
						data={procedure}
						horizontal
						keyExtractor={(item) => `${item.step}`}
						pagingEnabled
						showsHorizontalScrollIndicator={false}
						scrollEnabled={false}
						ref={flatListRef}
						onScroll={Animated.event(
							[
								{
									nativeEvent: {
										contentOffset: { x: scrollX },
									},
								},
							],
							{ useNativeDriver: true }
						)}
						renderItem={({ item, index }) => (
							<View
								style={{
									width,
								}}
							>
								<View
									style={{
										margin: sizing(6),
									}}
								>
									<View
										style={[
											presetStyles.row,
											{
												// marginTop: sizing(10),
												justifyContent: "space-between",
											},
										]}
									>
										{index >= 0 && (
											<Button
												style={[
													styles.button,
													{
														backgroundColor:
															"transparent",
													},
												]}
												titleStyle={{
													color: colors(colorScheme)
														.primary,
												}}
												title={t("back")}
												onPress={() => {
													if (
														index === 0 ||
														index === 3
													)
														return navigation.goBack();
													scrollToIndex(index - 1);
												}}
											/>
										)}
										{index < procedure.length &&
											(index === 3 ? (
												bookingRef !== "" && (
													<Button
														style={styles.button}
														title={
															item.preceedButtonText
														}
														titleStyle={{
															color:
																colorScheme ===
																"light"
																	? colors(
																			colorScheme
																	  )
																			.Languid_Lavende
																	: colors(
																			colorScheme
																	  )
																			.textPrimary,
														}}
														onPress={() =>
															handleOnMainPress(
																index
															)
														}
													/>
												)
											) : (
												<Button
													style={styles.button}
													title={
														item.preceedButtonText
													}
													onPress={() =>
														handleOnMainPress(index)
													}
												/>
											))}
									</View>
									<View
										style={{
											paddingTop: sizing(4),
										}}
									>
										<item.component
											isLoading={isLoading}
											isBookingLoading={isBookingLoading}
											bookingRef={bookingRef}
											addNewSection={addNewSection}
											removeSection={removeSection}
											replaceSection={replaceSection}
											resource={resource}
											branch={branch}
											timeslot={timeslot}
											date={date}
											tos={tos}
											dataSet={timeslotsinDays}
											isSuccess={isSuccess}
										/>
									</View>
								</View>
							</View>
						)}
					/>
				</Animatable.View>
			)}
		</Screen>
	);
}

export default CreateBookingScreen;
