import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import presetStyles, { sizing } from "../themes/presetStyles";
import colors from "../themes/colors";

function SettingsItem({
	title,
	iconColor,
	iconName,
	enter,
	provider = "MaterialIcons",
}) {
	return (
		<TouchableOpacity style={[presetStyles.row, styles.container]}>
			<View
				style={[
					styles.icon,
					{
						backgroundColor: iconColor,
					},
				]}
			>
				{provider === "MaterialIcons" && (
					<MaterialIcons
						name={iconName}
						size={sizing(5.5)}
						color={colors.backgroundSecondary}
					/>
				)}
				{provider === "MaterialCommunityIcons" && (
					<MaterialIcons
						name={iconName}
						size={sizing(5.5)}
						color={colors.backgroundSecondary}
					/>
				)}
			</View>
			<Text style={styles.title}>{title}</Text>
			{enter && (
				<MaterialCommunityIcons
					name="chevron-right"
					size={sizing(5.5)}
					color={colors.textSecondary}
				/>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		// marginBottom: sizing(4),
	},
	icon: {
		borderRadius: sizing(2),
		padding: sizing(1.5),
	},
	title: {
		flex: 1,
		marginLeft: sizing(3),
		color: colors.textPrimary,
	},
});

export default SettingsItem;
