import { useContext } from "react";
import { axiosInstance } from "../api/config";
import AuthContext from "./context";
import authStorage from "./storage";

export default function useAuth() {
	const { user, setUser } = useContext(AuthContext);

	const logIn = (authToken) => {
		authStorage.storeToken(authToken);
		fetchUser();
	};

	const logOut = () => {
		authStorage.removeToken();
		setUser(null);
	};

	const fetchUser = () =>
		axiosInstance.get(`/api/users/me`).then(({ data }) => {
			setUser(data);
		});

	return { user, setUser, logIn, logOut, fetchUser };
}
