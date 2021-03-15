import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { Root as PopupRoot, Popup, Toast } from "popup-ui";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";

import * as BioStorage from "./app/biometrics/storage";
import LoginScreen from "./app/screens/LoginScreen";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import { axiosInstance } from "./app/api/config";
import navigationTheme from "./app/themes/navigationTheme";
import AppDrawer from "./app/navigations/AppDrawer";
import BookingsNavigator from "./app/navigations/BookingsNavigator";

export default function App() {
	const [user, setUser] = useState();
	const [isReady, setIsReady] = useState(false);
	const netInfo = useNetInfo();

	if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false) {
		Popup.show({
			type: "Warning",
			title: "No Internet connection!",
			button: false,
			textBody: "Turn on Internet connection before using roomac.",
			callback: () => Popup.hide(),
		});
	}

	const restoreToken = async () => {
		const token = await authStorage.getToken();
		if (token) {
			loadBiometrics();
		} else {
			setIsReady(true);
		}
	};

	const loadBiometrics = async () => {
		const biometricsEnabled = await BioStorage.getEnable();
		if (biometricsEnabled) {
			const result = await LocalAuthentication.authenticateAsync({
				promptMessage: "Verify to continue authentication.",
			});
			if (result.success) {
				fetchUser();
			} else {
				alert("Authentication Failed");
			}
		} else {
			fetchUser();
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
				Popup.show({
					type: "Danger",
					title: "Something went wrong!",
					button: false,
					textBody: "Restart the App and try again",
					buttonText: "Ok",
					callback: () => Popup.hide(),
				});
			});

	useEffect(() => {
		restoreToken();
	}, []);

	return (
		<PopupRoot>
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
			{/* <OfflineNotice /> */}
		</PopupRoot>
	);
}
