import React from "react";
import { useColorScheme } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import routes from "./routes";
import ViewBookingsScreen from "../screens/ViewBookingsScreen";
import BookingDetailsScreen from "../screens/BookingDetailsScreen";
import colors from "../themes/colors";

const Stack = createStackNavigator();

export default function BookingsNavigator() {
	const colorScheme = useColorScheme();
	return (
		<Stack.Navigator initialRouteName={routes.screens.VIEW_BOOKINGS}>
			<Stack.Screen
				name={routes.screens.VIEW_BOOKINGS}
				component={ViewBookingsScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name={routes.screens.BOOKING_DETAILS}
				component={BookingDetailsScreen}
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
