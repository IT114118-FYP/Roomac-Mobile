import React from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	useColorScheme,
} from "react-native";
import { useFormikContext } from "formik";
import colors from "../themes/colors";
import { sizing } from "../themes/presetStyles";

function LoginButton({ title }) {
	const { handleSubmit } = useFormikContext();
	const colorScheme = useColorScheme();

	const styles = StyleSheet.create({
		container: {
			backgroundColor: colors(colorScheme).primary,
			justifyContent: "center",
			alignItems: "center",
			padding: sizing(4),
			borderRadius: sizing(3),
		},
		title: {
			fontSize: sizing(4),
			fontWeight: "700",
			color: "white",
		},
	});

	return (
		<TouchableOpacity style={styles.container} onPress={handleSubmit}>
			<Text style={styles.title}>{title}</Text>
		</TouchableOpacity>
	);
}

export default LoginButton;
