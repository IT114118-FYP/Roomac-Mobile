import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LottieView from "lottie-react-native";

import { AppNavigator } from "./app/navigations/AppNavigator";
import LoginScreen from "./app/screens/LoginScreen";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import { axiosInstance } from "./app/api/config";
import navigationTheme from "./app/themes/navigationTheme";

export default function App() {
	const [user, setUser] = useState();
	const [isReady, setIsReady] = useState(false);

	const restoreToken = async () => {
		const token = await authStorage.getToken();
		console.log(token);
		if (token) {
			fetchUser();
		} else return;
	};

	const fetchUser = () =>
		axiosInstance
			.get(`/api/users/me`)
			.then(({ data }) => {
				console.log(data);
				setUser(data);
				setIsReady(true);
			})
			.catch((error) => console.log(error))
			.finally(() => setIsReady(true));

	useEffect(() => {
		restoreToken();
	}, []);

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{isReady ? (
				<NavigationContainer theme={navigationTheme}>
					{user ? <AppNavigator /> : <LoginScreen />}
				</NavigationContainer>
			) : (
				<LottieView
					source={require("./assets/loading.json")}
					style={{
						flex: 1,
					}}
					autoPlay
					loop={false}
				/>
			)}
		</AuthContext.Provider>
	);
}
