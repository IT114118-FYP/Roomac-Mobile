import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import presetStyles, { sizing } from "../themes/presetStyles";
import colors from "../themes/colors";

export function ChevronRight() {
	return (
		<MaterialCommunityIcons
			name="chevron-right"
			size={sizing(5)}
			color={colors.textSecondary}
		/>
	);
}

function SettingsItem({
	title,
	description,
	LeftComponent,
	RightComponent,
	onPress,
}) {
	return (
		<TouchableOpacity
			style={[presetStyles.row, styles.container]}
			onPress={onPress}
		>
			{LeftComponent && (
				<View style={styles.left}>
					<LeftComponent />
				</View>
			)}
			<View style={styles.textContainer}>
				<Text style={styles.title}>{title}</Text>
				{description && (
					<Text style={styles.description}>{description}</Text>
				)}
			</View>
			{RightComponent && <RightComponent />}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: sizing(4),
	},
	left: {
		marginRight: sizing(3.5),
	},
	textContainer: {
		flex: 1,
	},
	title: {
		color: colors.textPrimary,
		fontSize: sizing(4),
	},
	description: {
		marginTop: sizing(1),
		color: colors.textSecondary,
		fontSize: sizing(3),
	},
});

export default SettingsItem;
