import * as SecureStore from "expo-secure-store";
import { axiosInstance } from "../api/config";

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
		const result = await fetchUser();
		return result.data;
	}
	return null;
};

const fetchUser = () => axiosInstance.get(`/api/users/me`);

export default {
	storeToken,
	removeToken,
	getUser,
	getToken,
};
