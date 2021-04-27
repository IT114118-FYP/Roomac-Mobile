import React from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { useFormikContext } from "formik";

import colors from "../themes/colors";
import { sizing } from "../themes/presetStyles";
import useColorScheme from "react-native/Libraries/Utilities/useColorScheme";

function Textfield({ name, title, helperText, placeholder, style, ...props }) {
	const {
		setFieldTouched,
		setFieldValue,
		errors,
		touched,
		values,
	} = useFormikContext();
	const colorScheme = useColorScheme();

	const styles = StyleSheet.create({
		container: {
			marginVertical: sizing(3),
		},
		input: {
			paddingTop: sizing(2),
			borderBottomWidth: 1,
			borderColor: colors(colorScheme).textPrimary,
		},
		text: {
			color: colors(colorScheme).textPrimary,
			fontSize: sizing(4.5),
		},
		helperText: {
			fontSize: sizing(4),
			color: colors(colorScheme).danger,
			marginTop: sizing(1),
		},
	});

	return (
		<View style={[styles.container, style]}>
			{title && <Text style={[styles.text, styles.title]}>{title}</Text>}
			<TextInput
				id={name}
				style={[styles.text, styles.input]}
				placeholderTextColor={colors(colorScheme).textSecondary + "77"}
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

export default Textfield;
