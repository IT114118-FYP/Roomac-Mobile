import i18n from "i18n-js";
import * as languages from "./locale/index";

const loadTranslations = () => {
	i18n.translations = languages;
	i18n.fallbacks = true;
	i18n.missingBehaviour = "guess";
};

const setLanguage = (lang) => {
	loadTranslations();
	i18n.locale =
		lang.substring(0, 2) === "en"
			? "en"
			: lang.includes("Hant")
			? "hk"
			: "cn";
};

const getLanguage = () => console.log(i18n.locale);

export default { setLanguage, getLanguage };
