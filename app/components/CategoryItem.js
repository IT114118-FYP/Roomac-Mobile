import React from "react";
import {
	StyleSheet,
	Text,
	Image,
	TouchableOpacity,
	useColorScheme,
} from "react-native";
import colors from "../themes/colors";

function CategoryItem({
	imageUrl,
	title,
	onPress,
	displayCard = true,
	selected,
}) {
	const colorScheme = useColorScheme();

	const styles = StyleSheet.create({
		container: {
			alignItems: "center",
			justifyContent: "center",
			paddingHorizontal: 12,
			paddingVertical: 6,
			borderRadius: 25,
		},
		image: {
			height: 184,
			borderRadius: 30,
			borderTopLeftRadius: 5,
			resizeMode: "cover",
		},
		title: {
			color: colors(colorScheme).textSecondary,
			fontSize: 14,
			fontWeight: "500",
			// marginTop: 8,
			marginHorizontal: 8,
		},
		listContainer: {
			flexDirection: "row",
		},
		listImage: {
			resizeMode: "cover",
			height: 125,
			width: 125,
			borderRadius: 10,
		},
	});

	return (
		<TouchableOpacity
			style={[
				styles.container,
				selected && {
					backgroundColor: colors().Powder_Blue,
				},
			]}
			onPress={onPress}
			disabled={selected}
		>
			{displayCard && (
				<Image
					source={{
						uri: imageUrl,
					}}
					style={displayCard ? styles.image : styles.listImage}
				/>
			)}
			<Text
				style={[
					styles.title,
					selected && {
						color: colors().textPrimary,
					},
				]}
			>
				{title}
			</Text>
		</TouchableOpacity>
	);
}

export default CategoryItem;
