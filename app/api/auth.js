import Constants from "expo-constants";
import { axiosInstance } from "./config";

const login = (email, password) =>
	axiosInstance.post("/api/login", {
		email: email,
		password: password,
		device_name: Constants.deviceName,
	});

const getUser = () => axiosInstance.get(`/api/users/me`);

const changePassword = (old_password, new_password) =>
	axiosInstance.post(`/api/users/me/password`, {
		old_password,
		new_password,
	});

export default {
	login,
	getUser,
	changePassword,
};
