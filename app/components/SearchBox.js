import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";

import presetStyles, { sizing } from "../themes/presetStyles";
import colors from "../themes/colors";

function SearchBox({ value, onChange, placeholder, ...props }) {
	return (
		<View style={[styles.searchBar, presetStyles.shadow]}>
			<Feather
				name="search"
				size={16}
				color={colors.textSecondary}
				style={styles.searchIcon}
			/>
			<TextInput
				{...props}
				style={styles.searchInput}
				placeholder={placeholder}
				value={value}
				onChangeText={onChange}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	searchIcon: {
		margin: 2,
		marginRight: 8,
	},
	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.backgroundPrimary,
		borderRadius: sizing(2),
		paddingHorizontal: sizing(3),
		marginVertical: sizing(2),
		marginHorizontal: sizing(6),
	},
	searchInput: {
		flex: 1,
		paddingVertical: sizing(3),
	},
});

export default SearchBox;
