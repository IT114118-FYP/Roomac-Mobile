import React from "react";
import { useColorScheme } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import routes from "./routes";
import SettingsScreen from "../screens/SettingsScreen";
import colors from "../themes/colors";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import ChangeLanguageScreen from "../screens/ChangeLanguageScreen";

const Stack = createStackNavigator();

export default function SettingsNavigator() {
	const colorScheme = useColorScheme();
	return (
		<Stack.Navigator initialRouteName={routes.screens.SETTINGS}>
			<Stack.Screen
				name={routes.screens.SETTINGS}
				component={SettingsScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name={routes.screens.CHANGE_PASSWORD}
				component={ChangePasswordScreen}
				options={{
					headerBackTitleVisible: false,
					headerTitle: false,
					headerTransparent: true,
					headerTintColor:
						colorScheme === "light"
							? colors().backgroundPrimary
							: colors(colorScheme).textPrimary,
				}}
			/>
			<Stack.Screen
				name={routes.screens.CHANGE_LANGUAGE}
				component={ChangeLanguageScreen}
				options={{
					headerBackTitleVisible: false,
					headerTitle: false,
					headerTransparent: true,
					headerTintColor:
						colorScheme === "light"
							? colors().backgroundPrimary
							: colors(colorScheme).textPrimary,
				}}
			/>
		</Stack.Navigator>
	);
}
