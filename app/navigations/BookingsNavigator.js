import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import routes from "./routes";
import ViewBookingsScreen from "../screens/ViewBookingsScreen";
import BookingDetailsScreen from "../screens/BookingDetailsScreen";

const Stack = createStackNavigator();

export default function BookingsNavigator() {
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
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
}
