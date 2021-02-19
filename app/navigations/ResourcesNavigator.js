import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DetailedCategoriesScreen from "../screens/DetailedCategoriesScreen";
import MainScreen from "../screens/MainScreen";

const Stack = createStackNavigator();

export function ResourcesNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Home"
				component={MainScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="DetailedCategories"
				component={DetailedCategoriesScreen}
				options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
}
