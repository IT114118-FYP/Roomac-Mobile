import React from "react";
import { View, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import DrawerContent from "./DrawerContent";
import routes from "./routes";
import AppNavigator from "./AppNavigator";
import ViewBookingsScreen from "../screens/ViewBookingsScreen";
import colors from "../themes/colors";

const Drawer = createDrawerNavigator();

function AppDrawer(props) {
	return (
		<Drawer.Navigator
			drawerContent={(props) => <DrawerContent {...props} />}
		>
			<Drawer.Screen name={routes.HOME} component={AppNavigator} />
			<Drawer.Screen
				name={routes.VIEW_BOOKINGS}
				component={ViewBookingsScreen}
			/>
			{/* <Drawer.Screen
				name={routes.VIEW_BOOKINGS}
				component={ViewBookingsScreen}
				options={{
					headerBackTitleVisible: false,
					headerTitle: false,
					headerTransparent: true,
					headerTintColor: colors.textPrimary,
				}}
			/> */}
		</Drawer.Navigator>
	);
}

export default AppDrawer;
