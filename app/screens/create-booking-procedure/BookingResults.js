import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import * as Animable from "react-native-animatable";

import colors from "../../themes/colors";
import { sizing } from "../../themes/presetStyles";
import routes from "../../navigations/routes";
import { useTranslation } from "react-i18next";
const { width } = Dimensions.get("window");

function BookingResults({ isLoading, bookingRef }) {
	const { t } = useTranslation([routes.screens.CREATE_BOOKING]);
	return (
		<View style={styles.container}>
			{isLoading ? (
				<LottieView
					source={require("../../../assets/BookingLoader.json")}
					style={styles.animation}
					autoPlay
				/>
			) : bookingRef === "" ? (
				<>
					<LottieView
						source={require("../../../assets/error.json")}
						style={styles.animation}
						autoPlay
						loop={false}
					/>
					<Animable.Text animation="wobble" style={styles.failed}>
						{t("results_failed")}
					</Animable.Text>
				</>
			) : (
				<>
					<LottieView
						source={require("../../../assets/success.json")}
						style={styles.animation}
						autoPlay
						loop={false}
					/>
					<Animable.Text animation="swing" style={styles.success}>
						{t("results_successful")}
					</Animable.Text>
					<Animable.Text animation="fadeIn" style={styles.ref}>
						{t("results_bookingRef", { value: bookingRef })}
					</Animable.Text>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
	},
	success: {
		color: colors.secondary,
		fontSize: sizing(7),
		fontWeight: "800",
	},
	failed: {
		color: "#CD5050",
		fontSize: sizing(7),
		fontWeight: "800",
	},
	ref: {
		color: colors.Cyber_Grape,
		margin: sizing(2),
	},
	animation: {
		width: width * 0.4,
		height: width * 0.4,
	},
});

export default BookingResults;
