import React, { useEffect, useState } from "react";
import { LogBox, BackHandler, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { Root as PopupRoot, Popup } from "popup-ui";
import { useNetInfo } from "@react-native-community/netinfo";
LogBox.ignoreLogs(["ReactNative.NativeModules.LottieAnimationView"]);

import * as BioStorage from "./app/biometrics/storage";
import LoginScreen from "./app/screens/LoginScreen";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import { axiosInstance } from "./app/api/config";
import navigationTheme from "./app/themes/navigationTheme";
import AppDrawer from "./app/navigations/AppDrawer";

import i18n from "./app/i18n/config";
import { I18nextProvider, useTranslation } from "react-i18next";

export default function App() {
	const [user, setUser] = useState();
	const [isReady, setIsReady] = useState(false);
	const netInfo = useNetInfo();
	const { t } = useTranslation(["app", "common"]);

	if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false) {
		Popup.show({
			type: "Warning",
			title: t("app:noInternet"),
			button: false,
			textBody: t("app:noInternetDescription"),
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

	const failedAlert = () => {
		Alert.alert(
			t("app:biometricsFailed"),
			t("app:bioNeeded"),
			[
				{
					text: t("retry"),
					onPress: () => loadBiometrics(),
				},
			],
			{ cancelable: false }
		);
	};

	const loadBiometrics = async () => {
		const biometricsEnabled = await BioStorage.getEnable();
		if (biometricsEnabled) {
			const result = await LocalAuthentication.authenticateAsync({
				promptMessage: t("app:biometrics"),
			});
			if (result.success) {
				fetchUser();
			} else {
				failedAlert();
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
			.catch(() => {
				authStorage.removeToken();
				Popup.show({
					type: "Danger",
					title: t("error"),
					buttonText: t("common:ok"),
					callback: () => {
						setUser(null);
						setIsReady(true);
						Popup.hide();
					},
				});
			});

	useEffect(() => {
		restoreToken();
	}, []);

	return (
		<I18nextProvider i18n={i18n}>
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
			</PopupRoot>
		</I18nextProvider>
	);
}
