import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import DrawerContent from "./DrawerContent";
import routes from "./routes";
import HomeNavigator from "./HomeNavigator";
import BookingsNavigator from "./BookingsNavigator";
import SettingsNavigator from "./SettingsNavigator";
import CampusLocationsScreen from "../screens/CampusLocationsScreen";

const Drawer = createDrawerNavigator();

function AppDrawer(props) {
	return (
		<Drawer.Navigator
			drawerContent={(props) => <DrawerContent {...props} />}
			// lazy={false}
		>
			<Drawer.Screen
				name={routes.navigators.HOME}
				component={HomeNavigator}
			/>
			<Drawer.Screen
				name={routes.navigators.BOOKINGS}
				component={BookingsNavigator}
			/>
			<Drawer.Screen
				name={routes.screens.CAMPUS_LOCATIONS}
				component={CampusLocationsScreen}
			/>
			<Drawer.Screen
				name={routes.navigators.SETTINGS}
				component={SettingsNavigator}
			/>
		</Drawer.Navigator>
	);
}

export default AppDrawer;
