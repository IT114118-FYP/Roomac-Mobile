import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { Root as PopupRoot, Popup, Toast } from "popup-ui";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";

import * as Localization from "expo-localization";
import {
	LanguageConfig,
	Translations,
	TranslationsContext,
} from "./app/i18n/index";

import * as BioStorage from "./app/biometrics/storage";
import LoginScreen from "./app/screens/LoginScreen";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import { axiosInstance } from "./app/api/config";
import navigationTheme from "./app/themes/navigationTheme";
import AppDrawer from "./app/navigations/AppDrawer";
import I18n from "i18n-js";

export default function App() {
	const [user, setUser] = useState();
	const [language, setLanguage] = useState(
		LanguageConfig.LanguageOptions.find(
			(lang) =>
				lang.key === LanguageConfig.getModifiedKey(Localization.locale)
		)
	);
	const [isReady, setIsReady] = useState(false);
	const netInfo = useNetInfo();

	if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false) {
		Popup.show({
			type: "Warning",
			title: Translations.getTranslatedString("noInternet", "App"),
			button: false,
			textBody: Translations.getTranslatedString(
				"noInternetDescription",
				"App"
			),
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
				promptMessage: Translations.getTranslatedString(
					"biometrics",
					"App"
				),
			});
			if (result.success) {
				fetchUser();
			} else {
				alert(
					Translations.getTranslatedString("biometricsFailed", "App")
				);
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
					title: Translations.getTranslatedString("error", "App"),
					button: false,
					textBody: Translations.getTranslatedString(
						"errorDescription",
						"App"
					),
					buttonText: Translations.getTranslatedString(
						"ok",
						"common"
					),
					callback: () => Popup.hide(),
				});
			});

	useEffect(() => {
		LanguageConfig.setLanguage(language);
		restoreToken();
	}, []);

	return (
		<TranslationsContext.Provider value={{ language, setLanguage }}>
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
		</TranslationsContext.Provider>
	);
}
