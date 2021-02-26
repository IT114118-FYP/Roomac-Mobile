import React from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { useFormikContext } from "formik";

import colors from "../themes/colors";

function Textfield({ name, title, helperText, placeholder, style, ...props }) {
	const {
		setFieldTouched,
		setFieldValue,
		errors,
		touched,
		values,
	} = useFormikContext();

	return (
		<View style={[styles.container, style]}>
			{title && <Text style={[styles.text, styles.title]}>{title}</Text>}
			<TextInput
				id={name}
				style={[styles.text, styles.input]}
				placeholder={placeholder}
				onChangeText={(text) => setFieldValue(name, text)}
				onBlur={() => setFieldTouched(name)}
				value={values[name]}
				helperText={touched[name] ? errors[name] : null}
				{...props}
			/>
			{touched[name] && (
				<Text style={styles.helperText}>{errors[name]}</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 12,
	},
	input: {
		paddingTop: 7,
		borderBottomWidth: 1,
		borderColor: colors.Oxford_Blue,
	},
	text: {
		color: colors.Oxford_Blue,
		fontSize: 18,
	},
	helperText: {
		fontSize: 16,
		color: "red",
		marginTop: 5,
	},
});

export default Textfield;
