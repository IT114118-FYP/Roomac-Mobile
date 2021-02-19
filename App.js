import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import MainScreen from "./app/screens/MainScreen";
import { AppNavigator } from "./app/navigations/AppNavigator";
import LoginScreen from "./app/screens/LoginScreen";
import AuthContext from "./app/auth/context";
import auth from "./app/api/auth";
import authStorage from "./app/auth/storage";
import { axiosInstance } from "./app/api/config";
import AppLoading from "expo-app-loading";
import navigationTheme from "./app/themes/navigationTheme";

export default function App() {
	const [user, setUser] = useState();
	const [isReady, setIsReady] = useState(false);

	const restoreToken = async () => {
		const token = await authStorage.getToken();
		if (!token) return;
		fetchUser();
	};

	const fetchUser = () =>
		axiosInstance.get(`/api/users/me`).then(({ data }) => {
			setUser(data);
		});

	if (!isReady)
		return (
			<AppLoading
				startAsync={restoreToken}
				onError={console.warn}
				onFinish={() => setIsReady(true)}
			/>
		);

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			<NavigationContainer theme={navigationTheme}>
				{user ? <AppNavigator /> : <LoginScreen />}
			</NavigationContainer>
		</AuthContext.Provider>
	);
}
