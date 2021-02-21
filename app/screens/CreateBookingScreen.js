import React, { useRef, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	Dimensions,
	Animated,
	Platform,
	// Button,
} from "react-native";
import * as Animatable from "react-native-animatable";
import * as Calendar from "expo-calendar";

import Button from "../components/Button";
import Screen from "../components/Screen";
import ProgressStepper from "../components/ProgressStepper";
import { axiosInstance } from "../api/config";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import {
	ConfirmBooking,
	SelectTime,
	TermsAndConditions,
} from "./create-booking-procedure";
import BookingResults from "./create-booking-procedure/BookingResults";

const { width } = Dimensions.get("window");

const procedure = [
	{
		step: 1,
		title: "Select Time",
		component: SelectTime,
		preceedButtonText: "Next",
	},
	{
		step: 2,
		title: "Terms & Conditions",
		component: TermsAndConditions,
		preceedButtonText: "Accept",
	},
	{
		step: 3,
		title: "Confirm Booking",
		component: ConfirmBooking,
		preceedButtonText: "Submit",
	},
	{
		step: 4,
		title: "Booking Results",
		component: BookingResults,
		preceedButtonText: "View in My Bookings",
	},
];

function CreateBookingScreen({ route, navigation }) {
	const { timeslot, item: resource, date } = route.params;
	const scrollX = React.useRef(new Animated.Value(0)).current;
	const flatListRef = useRef(null);
	const [listIndex, setListIndex] = useState(0);
	const [isLoading, setLoading] = useState(false);
	const [bookingRef, setBookingRef] = useState("");

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
			default:
				scrollToIndex(i + 1);
				break;
		}
	};

	const addBooking = () => {
		setLoading(true);
		axiosInstance
			.post(`/api/resources/${resource.id}/bookings`, {
				date: date,
				start: timeslot.start,
				end: timeslot.end,
			})
			.then(({ data }) => {
				console.log("good ", data);
				setBookingRef(data);
			})
			.catch((error) => {
				console.log("bad ", error);
			})
			.finally(() => {
				setLoading(false);
			});
	};
	return (
		<Screen>
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
								? "Last step, almost finish!"
								: listIndex < procedure.length - 1
								? `Next: ${procedure[listIndex + 1].title}`
								: ""}
						</Text>
					</Animated.View>
					<ProgressStepper
						containerStyle={styles.stepper}
						currentStep={listIndex + 1}
						steps={procedure.length}
						height={sizing(2)}
						color={colors.primary}
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
						[{ nativeEvent: { contentOffset: { x: scrollX } } }],
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
								<item.component
									resource={resource}
									timeslot={timeslot}
									tos={resource.tos}
									date={date}
									isLoading={isLoading}
									bookingRef={bookingRef}
								/>
								<View
									style={[
										presetStyles.row,
										{
											marginTop: sizing(10),
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
												color: colors.primary,
											}}
											title="Back"
											onPress={() => {
												if (index === 0 || index === 3)
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
													onPress={() =>
														handleOnMainPress(index)
													}
												/>
											)
										) : (
											<Button
												style={styles.button}
												title={item.preceedButtonText}
												onPress={() =>
													handleOnMainPress(index)
												}
												onPress={() =>
													handleOnMainPress(index)
												}
											/>
										))}
								</View>
							</View>
						</View>
					)}
				/>
			</Animatable.View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: sizing(6),
		marginTop: sizing(12),
	},
	title: {
		fontSize: sizing(8),
		fontWeight: "600",
		color: colors.Oxford_Blue,
	},
	next: {
		color: colors.textSecondary,
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

export default CreateBookingScreen;
