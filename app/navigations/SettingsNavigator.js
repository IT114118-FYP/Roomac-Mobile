import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import routes from "./routes";
import CampusLocationsScreen from "../screens/CampusLocationsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createStackNavigator();

export default function SettingsNavigator() {
	return (
		<Stack.Navigator
			initialRouteName={routes.screens.SETTINGS}
			screenOptions={{
				safeAreaInsets: { top: 0 },
			}}
		>
			<Stack.Screen
				name={routes.screens.SETTINGS}
				component={SettingsScreen}
				options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
}
