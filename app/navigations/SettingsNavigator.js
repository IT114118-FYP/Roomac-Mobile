import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import routes from "./routes";
import CampusLocationsScreen from "../screens/CampusLocationsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileSettingsScreen from "../screens/ProfileSettingsScreen";
import colors from "../themes/colors";

const Stack = createStackNavigator();

export default function SettingsNavigator() {
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
				name={routes.screens.PROFILE_SETTINGS}
				component={ProfileSettingsScreen}
				options={{
					headerBackTitleVisible: false,
					headerTitle: false,
					headerTransparent: true,
					headerTintColor: colors.textPrimary,
				}}
			/>
		</Stack.Navigator>
	);
}
