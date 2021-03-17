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
import useAuth from "../auth/useAuth";
import { sizing } from "../themes/presetStyles";
import { Translations } from "../i18n";

const validationSchema = Yup.object().shape({
	email: Yup.string()
		.required()
		.min(4)
		.label(Translations.getTranslatedString("email", "Login")),
	password: Yup.string()
		.required()
		.min(4)
		.label(Translations.getTranslatedString("password", "Login")),
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
					<Text style={styles.welcomeText}>
						{Translations.getTranslatedString("welcomeTo", "Login")}
					</Text>
					<Text style={styles.title}>
						{Translations.getTranslatedString("roomac", "common")}
					</Text>
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
											{Translations.getTranslatedString(
												"failedDescription",
												"Login"
											)}
										</Text>
									)}
									<Textfield
										name="email"
										title={Translations.getTranslatedString(
											"email",
											"Login"
										)}
										placeholder="example@email.com"
									/>
									<Textfield
										name="password"
										textContentType="password"
										secureTextEntry
										title={Translations.getTranslatedString(
											"password",
											"Login"
										)}
										placeholder={Translations.getTranslatedString(
											"password",
											"Login"
										)}
										style={styles.password}
									/>
									<LoginButton
										title={Translations.getTranslatedString(
											"signIn",
											"common"
										)}
									/>
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
									{Translations.getTranslatedString(
										"forgot",
										"Login"
									)}
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
