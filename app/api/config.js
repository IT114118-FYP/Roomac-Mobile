import * as axios from "axios";
import * as SecureStore from "expo-secure-store";

// const baseURL = "https://it114118-fyp.herokuapp.com";
const baseURL = "https://roomac.tatlead.com";

const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: {
		Authorization: "Bearer " + SecureStore.getItemAsync("authToken"),
	},
});

axiosInstance.interceptors.request.use(
	async (config) => {
		const authToken = await SecureStore.getItemAsync("authToken");
		config.headers = {
			Authorization: "Bearer " + authToken,
		};
		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);
export { axiosInstance };
