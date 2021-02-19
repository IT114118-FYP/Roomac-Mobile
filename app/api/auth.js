import Constants from "expo-constants";
import { axiosInstance } from "./config";

const login = (email, password) =>
	axiosInstance.post("/api/login", {
		email: email,
		password: password,
		device_name: Constants.deviceName,
	});

const getUser = () => axiosInstance.get(`/api/users/me`);

export default {
	login,
	getUser,
};
