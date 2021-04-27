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
	ScrollView,
	useColorScheme,
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
import presetStyles, { sizing } from "../themes/presetStyles";

function LoginScreen() {
	const { t, i18n } = useTranslation(["Login", "common"]);
	const colorScheme = useColorScheme();
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
				console.log(error);
				if (error.response.status === 402) {
					setLoginFailed(false);
					Popup.show({
						type: "Warning",
						title: t("banTitle"),
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

	const styles = StyleSheet.create({
		container: {
			paddingTop: sizing(4),
			paddingHorizontal: sizing(6),
		},
		welcomeText: {
			fontSize: sizing(5),
			color: colors(colorScheme).textPrimary,
		},
		title: {
			fontSize: sizing(14),
			fontWeight: "600",
			color: colors(colorScheme).textPrimary,
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
		form: {
			flex: 1,
		},
	});

	return (
		<Screen style={styles.container}>
			<ScrollView
				style={styles.form}
				showsVerticalScrollIndicator={false}
			>
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
							{/* <TouchableOpacity
								style={{
									alignItems: "center",
								}}
							>
								<Text
									style={{
										color: colors(colorScheme).textSecondary,
										fontSize: sizing(3),
									}}
								>
									{t("forgot")}
								</Text>
							</TouchableOpacity> */}
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			</ScrollView>
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

export default LoginScreen;
