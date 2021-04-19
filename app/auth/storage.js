import * as SecureStore from "expo-secure-store";
import auth from "../api/auth";

const key = "authToken";

const storeToken = async (authToken) => {
	try {
		await SecureStore.setItemAsync(key, authToken);
	} catch (error) {
		console.log("error storing token", error);
	}
};

const getToken = async () => {
	try {
		return await SecureStore.getItemAsync(key);
	} catch (error) {
		console.log("error getting token", error);
	}
};

const removeToken = async () => {
	try {
		return await SecureStore.deleteItemAsync(key);
	} catch (error) {
		console.log("error removing token", error);
	}
};

const getUser = async () => {
	const token = await getToken();
	if (token) {
		const result = await auth.getUser();
		return result.data;
	}
	return null;
};

export default {
	storeToken,
	removeToken,
	getUser,
	getToken,
};
