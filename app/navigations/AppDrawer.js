import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import DrawerContent from "./DrawerContent";
import routes from "./routes";
import HomeNavigator from "./HomeNavigator";
import BookingsNavigator from "./BookingsNavigator";

const Drawer = createDrawerNavigator();

function AppDrawer(props) {
	return (
		<Drawer.Navigator
			drawerContent={(props) => <DrawerContent {...props} />}
		>
			<Drawer.Screen
				name={routes.navigators.HOME}
				component={HomeNavigator}
			/>
			<Drawer.Screen
				name={routes.navigators.BOOKINGS}
				component={BookingsNavigator}
			/>
		</Drawer.Navigator>
	);
}

export default AppDrawer;
