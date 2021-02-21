import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, Modal } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import LottieView from "lottie-react-native";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

import LoginButton from "../components/LoginButton";
import Screen from "../components/Screen";
import Textfield from "../components/Textfield";
import colors from "../themes/colors";
import { axiosInstance } from "../api/config";
import auth from "../api/auth";
import ClassroomSvg from "../../assets/classroom";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import useAuth from "../auth/useAuth";

const validationSchema = Yup.object().shape({
	email: Yup.string().required().min(4).label("Email"),
	password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen(props) {
	const { logIn } = useAuth();
	const [isLoading, setLoading] = useState(false);
	const [loginFailed, setLoginFailed] = useState(false);

	const handleSubmit = async ({ email, password }) => {
		setLoading(true);
		const result = await auth.login(email, password);
		console.log(result);
		if (!result.data) return setLoginFailed(true);
		logIn(result.data);
		setLoading(false);
	};

	return (
		<Screen style={styles.container}>
			<View style={styles.form}>
				<View style={styles.titleView}>
					<Text style={styles.welcomeText}>Welcome to</Text>
					<Text style={styles.title}>Roomac</Text>
				</View>
				<Formik
					initialValues={{ email: "", password: "" }}
					onSubmit={handleSubmit}
					validationSchema={validationSchema}
				>
					<View style={styles.formContainer}>
						<Textfield
							name="email"
							title="Email"
							placeholder="email@example.com"
						/>
						<Textfield
							name="password"
							textContentType="password"
							secureTextEntry
							title="Password"
							placeholder="Password"
							style={styles.password}
						/>
						<LoginButton title="Sign In" />
					</View>
				</Formik>
			</View>
			<View style={styles.classroomSvg}>
				<ClassroomSvg />
			</View>
			<Modal
				visible={isLoading}
				animationType="fade"
				style={styles.loadingAnimation}
			>
				<LottieView
					source={require("../../assets/loading.json")}
					autoPlay
				/>
			</Modal>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 35,
	},
	welcomeText: {
		fontSize: 18,
		color: colors.Oxford_Blue,
	},
	title: {
		fontSize: 48,
		fontWeight: "500",
		color: colors.Oxford_Blue,
	},
	formContainer: {
		marginVertical: 24,
	},
	password: {
		marginBottom: 28,
	},
	loadingAnimation: {
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
	},
	classroomSvg: {
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 35,
	},
	form: {
		flex: 1,
	},
});

export default LoginScreen;
