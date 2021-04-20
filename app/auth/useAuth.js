import { useContext } from "react";
import AuthContext from "./context";
import authStorage from "./storage";
import * as BioStorage from "../biometrics/storage";
import auth from "../api/auth";

export default function useAuth() {
	const { user, setUser } = useContext(AuthContext);

	const logIn = (authToken) => {
		authStorage.storeToken(authToken);
		fetchUser();
	};

	const logOut = () => {
		authStorage.removeToken();
		BioStorage.storeEnable(false);
		setUser(null);
	};

	const fetchUser = () =>
		auth.getUser().then(({ data }) => {
			setUser(data);
		});

	return { user, setUser, logIn, logOut, fetchUser };
}
