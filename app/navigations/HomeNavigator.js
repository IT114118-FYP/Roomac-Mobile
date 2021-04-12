import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import colors from "../themes/colors";
import MainScreen from "../screens/MainScreen";
import DetailedResourcesScreen from "../screens/DetailedResourcesScreen";
import CreateBookingScreen from "../screens/CreateBookingScreen";
import ViewBookingsScreen from "../screens/ViewBookingsScreen";
import routes from "./routes";

const Stack = createStackNavigator();

export default function HomeNavigator() {
	return (
		<Stack.Navigator initialRouteName="Home">
			<Stack.Screen
				name={routes.screens.HOME}
				component={MainScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name={routes.screens.DETAILED_RESOURCES}
				component={DetailedResourcesScreen}
				options={{
					headerBackTitleVisible: false,
					headerTitle: false,
					headerTransparent: true,
					headerTintColor: colors.backgroundPrimary,
				}}
			/>
			<Stack.Screen
				name={routes.screens.CREATE_BOOKING}
				component={CreateBookingScreen}
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