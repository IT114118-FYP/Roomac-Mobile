import React, { Component } from "react";
import { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import moment from "moment";

import DrawerContent from "./DrawerContent";
import routes from "./routes";
import HomeNavigator from "./HomeNavigator";
import BookingsNavigator from "./BookingsNavigator";
import CampusNavigator from "./CampusNavigator";
import SettingsNavigator from "./SettingsNavigator";
// import BookingContext from "../hooks/bookings/context";
import { axiosInstance } from "../api/config";
import useAuth from "../auth/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Popup, Toast } from "popup-ui";

const Drawer = createDrawerNavigator();

function AppDrawer(props) {
	const [bookings, setBookings] = useState([]);
	const { user } = useAuth();
	// const { fetchBookings } = useBookings();

	// const fetchBookings = () => {
	// 	axiosInstance(
	// 		`/api/users/${user.id}/bookings?start=${moment().format(
	// 			"YYYY-MM-DD"
	// 		)}&end=${moment().add(10, "days").format("YYYY-MM-DD")}`
	// 	).then(({ data }) => {
	// 		console.log(data);
	// 		setBookings(data);
	// 	});
	// };

	// useEffect(() => {
	// 	fetchBookings();
	// }, []);

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
			<Drawer.Screen
				name={routes.navigators.CAMPUS}
				component={CampusNavigator}
			/>
			<Drawer.Screen
				name={routes.navigators.SETTINGS}
				component={SettingsNavigator}
			/>
		</Drawer.Navigator>
	);
}

export default AppDrawer;
