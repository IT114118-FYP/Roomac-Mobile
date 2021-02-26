import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	Modal,
	KeyboardAvoidingView,
	Keyboard,
	Platform,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import LottieView from "lottie-react-native";

import LoginButton from "../components/LoginButton";
import Screen from "../components/Screen";
import Textfield from "../components/Textfield";
import colors from "../themes/colors";
import auth from "../api/auth";
import ClassroomSvg from "../../assets/classroom";
import useAuth from "../auth/useAuth";
import { sizing } from "../themes/presetStyles";

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
		auth.login(email, password)
			.then(({ data }) => {
				logIn(data);
				setLoginFailed(false);
				setLoading(false);
			})
			.catch(() => {
				setLoginFailed(true);
				setLoading(false);
			});
	};

	return (
		<Screen style={styles.container}>
			<View style={styles.form}>
				<View style={styles.titleView}>
					<Text style={styles.welcomeText}>Welcome to</Text>
					<Text style={styles.title}>Roomac</Text>
				</View>
				<KeyboardAvoidingView
					behavior={Platform.OS == "ios" ? "padding" : "height"}
					style={{
						flex: 1,
					}}
				>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View
							style={{
								flex: 1,
							}}
						>
							<Formik
								initialValues={{ email: "", password: "" }}
								onSubmit={handleSubmit}
								validationSchema={validationSchema}
							>
								<View style={styles.formContainer}>
									{loginFailed && (
										<Text
											style={{
												color: "red",
											}}
										>
											Email/CNA or password is incorrect.
										</Text>
									)}
									<Textfield
										name="email"
										title="Email"
										placeholder="example@email.com"
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
							<TouchableOpacity
								style={{
									alignItems: "center",
								}}
							>
								<Text
									style={{
										color: colors.textSecondary,
										fontSize: sizing(3),
									}}
								>
									Forgot your password?
								</Text>
							</TouchableOpacity>
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			</View>
			{/* <View style={styles.classroomSvg}>
				<ClassroomSvg />
			</View> */}
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
		padding: sizing(8),
	},
	welcomeText: {
		fontSize: sizing(5),
		color: colors.Oxford_Blue,
	},
	title: {
		fontSize: sizing(12),
		fontWeight: "600",
		color: colors.Oxford_Blue,
	},
	formContainer: {
		marginVertical: sizing(6),
	},
	password: {
		marginBottom: sizing(7),
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
