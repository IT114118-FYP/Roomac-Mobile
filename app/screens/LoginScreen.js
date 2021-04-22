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
import { setLocale } from "yup";
import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";
import { Popup } from "popup-ui";

import LoginButton from "../components/LoginButton";
import Screen from "../components/Screen";
import Textfield from "../components/Textfield";
import colors from "../themes/colors";
import auth from "../api/auth";
import useAuth from "../auth/useAuth";
import { sizing } from "../themes/presetStyles";

function LoginScreen(props) {
	const { t, i18n } = useTranslation(["Login", "common"]);
	const { logIn } = useAuth();
	const [isLoading, setLoading] = useState(false);
	const [loginFailed, setLoginFailed] = useState(false);

	setLocale({
		mixed: {
			required: (required) =>
				t("common:required", { label: required.label }),
		},
		string: {
			min: (min) =>
				t("common:short", { label: min.label, value: min.min }),
		},
	});

	const validationSchema = Yup.object().shape({
		email: Yup.string().required().min(4).label(t("email")),
		password: Yup.string().required().min(4).label(t("password")),
	});

	const handleSubmit = async ({ email, password }) => {
		setLoading(true);
		auth.login(email, password)
			.then(({ data }) => {
				console.log(data);
				logIn(data);
				setLoginFailed(false);
			})
			.catch((error) => {
				console.log("====================================");
				console.log(error);
				console.log("====================================");
				if (error.response.status === 402) {
					setLoginFailed(false);
					Popup.show({
						type: "Warning",
						title: t("banTitle"),
						// button: false,
						buttonText: t("common:ok"),
						textBody: t("banDescription", {
							value: error.response.data,
						}),
						callback: () => Popup.hide(),
					});
					setLoading(false);
				} else {
					setLoginFailed(true);
				}
			})
			.finally(() => setLoading(false));
	};

	return (
		<Screen style={styles.container}>
			<View style={styles.form}>
				<View style={styles.titleView}>
					<Text style={styles.welcomeText}>{t("welcomeTo")}</Text>
					<Text style={styles.title}>{t("roomac")}</Text>
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
											{t("failedDescription")}
										</Text>
									)}
									<Textfield
										name="email"
										title={t("email")}
										placeholder="example@email.com"
									/>
									<Textfield
										name="password"
										textContentType="password"
										secureTextEntry
										title={t("password")}
										placeholder={t("password")}
										style={styles.password}
									/>
									<LoginButton title={t("common:signIn")} />
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
									{t("forgot")}
								</Text>
							</TouchableOpacity>
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
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
		padding: sizing(8),
	},
	welcomeText: {
		fontSize: sizing(5),
		color: colors.Oxford_Blue,
	},
	title: {
		fontSize: sizing(14),
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
