import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import routes from "./routes";
import SettingsScreen from "../screens/SettingsScreen";
import colors from "../themes/colors";
import TOSscreen from "../screens/TOSscreen";

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
				name={routes.screens.TERMS_AND_CONDITION}
				component={TOSscreen}
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
