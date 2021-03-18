import i18n from "i18n-js";
import TranslationsStorage from "./storage";
import * as languages from "./locale/index";

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
		label: "簡体中文",
	},
];

const loadTranslations = () => {
	i18n.translations = languages;
	i18n.fallbacks = true;
	i18n.missingBehaviour = "guess";
};

const setLanguage = async (lang) => {
	console.log("====================================");
	console.log(lang);
	console.log("====================================");
	loadTranslations();
	const preference = await TranslationsStorage.getLanguagePreference();
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
	LanguageOptions,
};
