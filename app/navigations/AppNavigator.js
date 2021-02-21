import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MainScreen from "../screens/MainScreen";
import DetailedResourcesScreen from "../screens/DetailedResourcesScreen";

import { enableScreens } from "react-native-screens";
import CreateBookingScreen from "../screens/CreateBookingScreen";
import colors from "../themes/colors";
enableScreens();

const Stack = createStackNavigator();

export function AppNavigator() {
	return (
		<Stack.Navigator initialRouteName="Home">
			<Stack.Screen
				name="Home"
				component={MainScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="DetailedResources"
				component={DetailedResourcesScreen}
				options={{
					headerBackTitleVisible: false,
					headerTitle: false,
					headerTransparent: true,
					headerTintColor: "#FFF",
				}}
			/>
			<Stack.Screen
				name="CreateBooking"
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
