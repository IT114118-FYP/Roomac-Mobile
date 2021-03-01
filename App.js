import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LottieView from "lottie-react-native";

import LoginScreen from "./app/screens/LoginScreen";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import { axiosInstance } from "./app/api/config";
import navigationTheme from "./app/themes/navigationTheme";
import AppDrawer from "./app/navigations/AppDrawer";

export default function App() {
	const [user, setUser] = useState();
	const [isReady, setIsReady] = useState(false);

	const restoreToken = async () => {
		const token = await authStorage.getToken();
		if (token) {
			fetchUser();
		} else {
			setIsReady(true);
		}
	};

	const fetchUser = () =>
		axiosInstance
			.get(`/api/users/me`)
			.then(({ data }) => {
				setUser(data);
				setIsReady(true);
			})
			.catch((error) => {
				console.log(error);
				authStorage.removeToken();
				alert("Something went wrong!");
			});

	useEffect(() => {
		restoreToken();
	}, []);

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{isReady ? (
				<NavigationContainer theme={navigationTheme}>
					{user ? <AppDrawer /> : <LoginScreen />}
				</NavigationContainer>
			) : (
				<LottieView
					source={require("./assets/roomac-animation.json")}
					style={{
						flex: 1,
					}}
					autoPlay
					loop
				/>
			)}
		</AuthContext.Provider>
	);
}
