import React from "react";
import {
	View,
	StyleSheet,
	Text,
	Image,
	ImageBackground,
	TouchableOpacity,
	useColorScheme,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../themes/colors";
import { sizing } from "../themes/presetStyles";

function CampusItem({ imageUrl, title, onPress }) {
	const colorScheme = useColorScheme();
	const styles = StyleSheet.create({
		container: {
			marginBottom: sizing(8),
			borderRadius: sizing(4),
			// overflow: "hidden",
		},
		imageContainer: {
			height: sizing(25),
		},
		image: {
			overflow: "hidden",
			borderRadius: sizing(4),
		},
		title: {
			fontSize: sizing(6),
			fontWeight: "bold",
			color:
				colorScheme === "light"
					? colors(colorScheme).backgroundPrimary
					: colors(colorScheme).textPrimary,
			textShadowColor: colors(colorScheme).textPrimary,
			padding: sizing(5),
		},
		checkbox: {
			// height: sizing(8),
			// width: sizing(8),
			padding: sizing(1),
			borderRadius: sizing(5),
			backgroundColor: colors(colorScheme).Powder_Blue,
			position: "absolute",
			top: -sizing(3),
			left: -sizing(3),
		},
	});
	return (
		<TouchableOpacity style={styles.container} onPress={onPress}>
			<ImageBackground
				source={{ uri: imageUrl }}
				imageStyle={styles.image}
				style={styles.imageContainer}
			>
				<LinearGradient
					colors={["rgba(0, 0, 0, 0.8)", "transparent"]}
					style={{ flex: 1, borderRadius: sizing(4) }}
				>
					<Text style={styles.title}>{title}</Text>
				</LinearGradient>
			</ImageBackground>
		</TouchableOpacity>
	);
}

export default CampusItem;
