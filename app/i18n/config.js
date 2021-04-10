import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

import * as resources from "./locale/index";
import routes from "../navigations/routes";
import { getLanguagePreference } from "./func";

const languageDetector = {
	type: "languageDetector",
	async: true, // async detection
	detect: (callback) => {
		console.log("error");
		AsyncStorage.getItem("languageOptions").then((lng) => {
			console.log("===asdas=================================");
			console.log(lng);
			console.log("====asdasd================================");
			if (lng === null) {
				callback(
					Localization.locale.substring(0, 2) === "zh"
						? lang.includes("Hant")
							? "hk"
							: "cn"
						: "en"
				);
			} else {
				callback(lng.key);
			}
		});
	},
	init: () => {},
	cacheUserLanguage: () => {},
};

i18n.use(languageDetector)
	.use(initReactI18next)
	.init({
		lng:
			Localization.locale.substring(0, 2) === "zh"
				? lang.includes("Hant")
					? "hk"
					: "cn"
				: "en",
		fallbackLng: "en",
		ns: [
			"common",
			"App",
			"Login",
			routes.screens.HOME,
			routes.screens.DETAILED_RESOURCES,
			routes.screens.CREATE_BOOKING,
			routes.screens.VIEW_BOOKINGS,
			routes.screens.BOOKING_DETAILS,
			routes.screens.SETTINGS,
			routes.screens.CHANGE_PASSWORD,
			routes.screens.CHANGE_LANGUAGE,
		],
		resources,
	});

export default i18n;
