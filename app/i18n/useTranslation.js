import { useContext, useEffect } from "react";
import i18n from "i18n-js";

import TranslationsContext from "./context";
import TranslationsStorage from "./storage";

export default function useTranslation() {
	const { language, setLanguage } = useContext(TranslationsContext);

	useEffect(() => {
		console.log("From translation: " + language.key);
	}, [language]);

	const changeLanguage = (lang) => {
		TranslationsStorage.storeLanguagePreference(lang);
		setLanguage(lang);
	};

	const getTranslatedString = (name, screen, additionalValue) =>
		i18n.t(screen + "." + name, { value: additionalValue });

	const getTranslatedStringFromProvider = (provider) => provider[i18n.locale];

	return {
		language,
		setLanguage,
		changeLanguage,
		getTranslatedString,
		getTranslatedStringFromProvider,
	};
}
