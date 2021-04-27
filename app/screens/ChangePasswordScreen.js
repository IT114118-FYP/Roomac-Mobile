import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	Keyboard,
	Modal,
	useColorScheme,
} from "react-native";
import { Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import LottieView from "lottie-react-native";

import Screen from "../components/Screen";
import Button from "../components/Button";
import colors from "../themes/colors";
import { sizing } from "../themes/presetStyles";
import useAuth from "../auth/useAuth";
import { Popup } from "popup-ui";
import routes from "../navigations/routes";
import { useTranslation } from "react-i18next";
import auth from "../api/auth";

const PasswordField = ({
	name,
	title,
	helperText,
	placeholder,
	style,
	...props
}) => {
	const {
		setFieldTouched,
		setFieldValue,
		errors,
		touched,
		values,
	} = useFormikContext();
	const colorScheme = useColorScheme();
	return (
		<View
			style={[
				{
					paddingVertical: sizing(2),
					marginVertical: sizing(2),
				},
				style,
			]}
		>
			{title && (
				<Text
					style={{
						fontSize: sizing(4),
						color: colors(colorScheme).textPrimary,
					}}
				>
					{title}
				</Text>
			)}
			<TextInput
				id={name}
				style={{
					paddingTop: sizing(2),
					borderBottomWidth: 1,
					borderColor: colors(colorScheme).textPrimary,
					fontSize: sizing(4),
					color: colors(colorScheme).textPrimary,
				}}
				secureTextEntry
				placeholder={placeholder}
				onChangeText={(text) => setFieldValue(name, text)}
				onBlur={() => setFieldTouched(name)}
				value={values[name]}
				helperText={touched[name] ? errors[name] : null}
				{...props}
			/>
			{touched[name] && (
				<Text
					style={{
						fontSize: sizing(4),
						color: colors(colorScheme).danger,
						marginTop: sizing(1),
					}}
				>
					{errors[name]}
				</Text>
			)}
		</View>
	);
};

const SubmitButton = () => {
	const { handleSubmit } = useFormikContext();
	const { t } = useTranslation([routes.screens.CHANGE_PASSWORD]);
	return <Button title={t("submit")} onPress={handleSubmit} />;
};

function ChangePasswordScreen(props) {
	const { logOut } = useAuth();
	const { t, i18n } = useTranslation([
		routes.screens.CHANGE_PASSWORD,
		"common",
	]);
	const colorScheme = useColorScheme();
	const [isLoading, setLoading] = useState(false);

	const styles = StyleSheet.create({
		container: {
			paddingHorizontal: sizing(6),
		},
		title: {
			fontSize: sizing(8),
			fontWeight: "600",
			color: colors(colorScheme).textPrimary,
			marginTop: sizing(14),
			marginBottom: sizing(4),
			paddingHorizontal: sizing(6),
		},
	});

	Yup.setLocale({
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
		old: Yup.string().required().min(4).label(t("old")),
		password: Yup.string()
			.required()
			.matches(
				/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
				t("passwordRequirement")
			)
			.label(t("new")),
		passwordConfirmation: Yup.string().oneOf(
			[Yup.ref("password"), null],
			t("passwordMatch")
		),
	});

	const handleSubmit = ({ old, password }) => {
		setLoading(true);
		Keyboard.dismiss();
		auth.changePassword(old, password)
			.then(() => {
				Popup.show({
					type: "Success",
					title: t("common:success"),
					textBody: t("changeSuccessText"),
					buttonText: t("common:signIn"),
					callback: () => {
						Popup.hide();
						logOut();
					},
				});
			})
			.catch(() =>
				Popup.show({
					type: "Danger",
					title: t("common:failed"),
					buttonText: t("common:ok"),
					// button: false,
					textBody: t("changeFailedText"),
					callback: () => Popup.hide(),
				})
			)
			.finally(() => setLoading(false));
	};

	return (
		<Screen>
			{!isLoading && (
				<>
					<Text style={styles.title}>{t("title")}</Text>
					<Formik
						initialValues={{
							old: "",
							password: "",
							passwordConfirmation: "",
						}}
						onSubmit={handleSubmit}
						validationSchema={validationSchema}
					>
						<View style={styles.container}>
							<PasswordField title={t("enterOld")} name="old" />
							<PasswordField
								title={t("enterNew")}
								name="password"
							/>
							<PasswordField
								title={t("confirmNew")}
								name="passwordConfirmation"
							/>
							<SubmitButton />
						</View>
					</Formik>
				</>
			)}
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

export default ChangePasswordScreen;
