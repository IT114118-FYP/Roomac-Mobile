import AsyncStorage from "@react-native-async-storage/async-storage";

const TAG = "useBiometrics";

const storeEnable = async (isEnabled) => {
	try {
		await AsyncStorage.setItem(TAG, isEnabled.toString());
	} catch (error) {
		console.log(error);
	}
};

const getEnable = async (isEnabled) => {
	try {
		const result = await AsyncStorage.getItem(TAG);
		return result === "true";
	} catch (error) {
		console.log(error);
	}
	return false;
};

export { storeEnable, getEnable };
