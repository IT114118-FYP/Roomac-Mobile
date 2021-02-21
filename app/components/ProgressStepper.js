import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";

function ProgressStepper({
	currentStep,
	steps,
	height,
	color,
	containerStyle,
}) {
	const [width, setWidth] = useState(0);
	const animatedValue = useRef(new Animated.Value(-1000)).current;
	const reactive = useRef(new Animated.Value(-1000)).current;

	useEffect(() => {
		Animated.spring(animatedValue, {
			toValue: reactive,
			bounciness: 5,
			duration: 1000,
			useNativeDriver: true,
		}).start();
	}, []);

	useEffect(() => {
		reactive.setValue(-width + (width * currentStep) / steps);
	}, [currentStep, width]);

	return (
		<View
			style={[
				{
					height,
					backgroundColor: color + "4f",
					borderRadius: height,
					overflow: "hidden",
				},
				containerStyle,
			]}
		>
			<Animated.View
				onLayout={(event) => {
					const newWidth = event.nativeEvent.layout.width;
					setWidth(newWidth);
				}}
				style={{
					height,
					width: "100%",
					borderRadius: height,
					backgroundColor: color,
					position: "absolute",
					top: 0,
					left: 0,
					transform: [
						{
							translateX: animatedValue,
						},
					],
				}}
			></Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default ProgressStepper;
