import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFormikContext } from "formik";
import colors from "../themes/colors";

function LoginButton({ title, style }) {
	const { handleSubmit } = useFormikContext();
	return (
		<TouchableOpacity style={[styles.container]} onPress={handleSubmit}>
			<Text style={styles.title}>{title}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.Cyber_Grape,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
		borderRadius: 10,
	},
	title: {
		fontSize: 18,
		fontWeight: "700",
		color: "white",
	},
});

export default LoginButton;
