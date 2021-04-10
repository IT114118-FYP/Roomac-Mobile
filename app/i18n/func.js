import AsyncStorage from "@react-native-async-storage/async-storage";

const TAG = "languageOptions";

export const getTranslatedStringFromProvider = (lang, provider) =>
	provider[lang];

export const storeLanguagePreference = async (languageOptions) => {
	try {
		await AsyncStorage.setItem(TAG, JSON.stringify(languageOptions));
		getLanguagePreference();
	} catch (error) {
		console.log(error);
	}
};

export const getLanguagePreference = async () => {
	try {
		const preference = await AsyncStorage.getItem(TAG);
		console.log("====================================");
		console.log(JSON.parse(preference));
		console.log("====================================");
		return preference != null ? JSON.parse(preference) : null;
	} catch (error) {
		console.log(error);
	}
};
