import React, { useRef, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	Dimensions,
	Animated,
	Platform,
} from "react-native";
import * as Animatable from "react-native-animatable";

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
	BookingResults,
} from "./create-booking-procedure";
import routes from "../navigations/routes";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

function CreateBookingScreen({ route, navigation }) {
	const { timeslot, item: resource, date } = route.params;
	const { t, i18n } = useTranslation([routes.screens.CREATE_BOOKING]);
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

	const addBooking = () => {
		setLoading(true);
		axiosInstance
			.post(`/api/resources/${resource.id}/bookings`, {
				date: date,
				start: timeslot.start,
				end: timeslot.end,
			})
			.then(({ data }) => {
				setBookingRef(data);
			})
			.catch((error) => {
				console.log(error);
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
		marginHorizontal: sizing(8),
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
