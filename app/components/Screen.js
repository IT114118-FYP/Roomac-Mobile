import React from "react";
import {
	StyleSheet,
	SafeAreaView,
	View,
	StatusBar,
	Platform,
	useColorScheme,
} from "react-native";
import colors from "../themes/colors";

function Screen({ children, style }) {
	const colorScheme = useColorScheme();
	const styles = StyleSheet.create({
		screen: {
			// paddingTop: Constants.statusBarHeight,
			flex: 1,
			// backgroundColor: colors(colorScheme).backgroundPrimary,
			backgroundColor:
				colorScheme === "light"
					? colors(colorScheme).backgroundSecondary
					: colors(colorScheme).backgroundPrimary,
		},
		view: {
			flex: 1,
		},
	});
	return (
		<SafeAreaView style={[styles.screen, style]}>
			{Platform.OS === "ios" && (
				<StatusBar
					barStyle={
						colorScheme === "light"
							? "dark-content"
							: "light-content"
					}
				/>
			)}
			<View style={[styles.view, style]}>{children}</View>
		</SafeAreaView>
	);
}

export default Screen;
