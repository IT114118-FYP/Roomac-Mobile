import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

import * as resources from "./locale/index";
import routes from "../navigations/routes";

i18n.use(initReactI18next).init({
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
		routes.screens.CHECKIN,
		routes.screens.SEARCH,
	],
	resources,
});

export default i18n;
