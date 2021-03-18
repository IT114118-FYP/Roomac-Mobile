import i18n from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as languages from "./locale/index";

const TAG = "languageOptions";

const LanguageOptions = [
	{
		id: 1,
		key: "en",
		label: "English",
	},
	{
		id: 2,
		key: "hk",
		label: "繁體中文",
	},
	{
		id: 3,
		key: "cn",
		label: "簡體中文",
	},
];

const storeLanguagePreference = async (languageOptions) => {
	try {
		console.log("====================================");
		console.log(languageOptions);
		console.log("====================================");
		await AsyncStorage.setItem(TAG, JSON.stringify(languageOptions));
	} catch (error) {
		console.log(error);
	}
};

const getLanguagePreference = async () => {
	try {
		const preference = await AsyncStorage.getItem(TAG);
		return preference != null ? JSON.parse(preference) : null;
	} catch (error) {
		console.log(error);
	}
};

const loadTranslations = () => {
	i18n.translations = languages;
	i18n.fallbacks = true;
	i18n.missingBehaviour = "guess";
};

const setLanguage = async (lang) => {
	loadTranslations();
	const preference = await getLanguagePreference();
	console.log(preference);
	if (preference != null) {
		i18n.locale = preference.key;
	} else {
		i18n.locale = getModifiedKey(lang);
	}
};

const getModifiedKey = (lang) => {
	const modded =
		lang.substring(0, 2) === "zh"
			? lang.includes("Hant")
				? "hk"
				: "cn"
			: "en";

	return modded;
};

const getLanguage = () =>
	LanguageOptions.find((lang) => lang.key === i18n.locale);

export default {
	setLanguage,
	getLanguage,
	getModifiedKey,
	storeLanguagePreference,
	LanguageOptions,
};
