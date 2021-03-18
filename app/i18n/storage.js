import AsyncStorage from "@react-native-async-storage/async-storage";

const TAG = "languageOptions";

const storeLanguagePreference = async (languageOptions) => {
	try {
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

export default { getLanguagePreference, storeLanguagePreference };
