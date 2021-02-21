import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import * as Animable from "react-native-animatable";
import colors from "../../themes/colors";
import { sizing } from "../../themes/presetStyles";
const { width } = Dimensions.get("window");

function BookingResults({ isLoading, bookingRef }) {
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
						Failed...
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
						Successful!
					</Animable.Text>
					<Animable.Text animation="fadeIn" style={styles.ref}>
						Booking Referrence: {bookingRef}
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
