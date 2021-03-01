import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import routes from "./routes";
import CampusLocationsScreen from "../screens/CampusLocationsScreen";

const Stack = createStackNavigator();

export default function CampusNavigator() {
	return (
		<Stack.Navigator
			initialRouteName={routes.screens.VIEW_BOOKINGS}
			screenOptions={{
				safeAreaInsets: { top: 0 },
			}}
		>
			<Stack.Screen
				name={routes.screens.VIEW_BOOKINGS}
				component={CampusLocationsScreen}
				options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
}
