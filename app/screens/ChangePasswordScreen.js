import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	Modal,
} from "react-native";
import { Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import LottieView from "lottie-react-native";

import Screen from "../components/Screen";
import Button from "../components/Button";
import colors from "../themes/colors";
import { sizing } from "../themes/presetStyles";
import { axiosInstance } from "../api/config";
import useAuth from "../auth/useAuth";
import { Popup } from "popup-ui";

const validationSchema = Yup.object().shape({
	old: Yup.string().required().min(4).label("Old Password"),
	password: Yup.string()
		.required()
		.matches(
			/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
			"Must Contain 8 Characters, One Uppercase, One Lowercase and one Number"
		)
		.label("New Password"),
	passwordConfirmation: Yup.string().oneOf(
		[Yup.ref("password"), null],
		"Passwords must match"
	),
});

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
						color: colors.textSecondary,
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
					borderColor: colors.Oxford_Blue,
					fontSize: sizing(4),
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
						color: "red",
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
	return <Button title="Submit New Password" onPress={handleSubmit} />;
};

function ChangePasswordScreen(props) {
	const { user, logOut } = useAuth();
	const [isLoading, setLoading] = useState(false);

	const handleSubmit = ({ old, password }) => {
		setLoading(true);
		Keyboard.dismiss();
		axiosInstance
			.post(`/api/users/me/password`, {
				old_password: old,
				new_password: password,
			})
			.then(({ data }) => {
				Popup.show({
					type: "Success",
					title: "Success",
					// button: false,
					textBody: "Password change, sign in now with new password",
					buttonText: "Sign In",
					callback: () => {
						Popup.hide();
						logOut();
					},
				});
			})
			.catch(() =>
				Popup.show({
					type: "Danger",
					title: "Failed",
					buttonText: "Ok",
					// button: false,
					textBody: "Make sure the old password is correct.",
					callback: () => Popup.hide(),
				})
			)
			.finally(() => setLoading(false));
	};

	return (
		<Screen>
			{!isLoading && (
				<>
					<Text style={styles.title}>Change Password</Text>

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
							<PasswordField
								title="Enter old password"
								name="old"
							/>
							<PasswordField
								title="Enter new password"
								name="password"
							/>
							<PasswordField
								title="Confirm new password"
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

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: sizing(6),
	},
	title: {
		fontSize: sizing(8),
		fontWeight: "600",
		color: colors.Oxford_Blue,
		marginTop: sizing(14),
		marginBottom: sizing(4),
		paddingHorizontal: sizing(6),
	},
});

export default ChangePasswordScreen;
