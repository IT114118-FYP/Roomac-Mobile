import i18n from "i18n-js";

const getTranslatedString = (name, screen, additionalValue) =>
	i18n.t(screen + "." + name, { value: additionalValue });

const getTranslatedStringFromProvider = (provider) => provider[i18n.locale];

export default { getTranslatedString, getTranslatedStringFromProvider };
