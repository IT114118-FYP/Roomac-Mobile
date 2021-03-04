import axios from "axios";
import { setNestedObjectValues } from "formik";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Markdown from "react-native-markdown-display";
import { axiosInstance } from "../api/config";
import Screen from "../components/Screen";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";

function TOSscreen(props) {
	const [tos, setTos] = useState();
	const [isLoading, setLoading] = useState(true);

	const fetchTos = () => {
		setLoading(true);
		axiosInstance
			.get(`/api/tos`)
			.then(({ data }) => {
				setTos(data);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchTos();
	}, []);

	return (
		<Screen style={styles.container}>
			<Text style={styles.title}>Terms & Condition</Text>

			{!isLoading && (
				<View style={presetStyles.marginHorizontal}>
					<Markdown
						style={{
							text: {
								fontSize: sizing(4),
							},
							list_item: {
								flexDirection: "row",
								justifyContent: "flex-start",
								marginBottom: sizing(4),
							},
						}}
					>
						{tos[0].tos_en}
					</Markdown>
				</View>
			)}
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {},
	title: {
		fontSize: sizing(8),
		fontWeight: "600",
		color: colors.Oxford_Blue,
		marginTop: sizing(14),
		marginBottom: sizing(6),
		paddingHorizontal: sizing(6),
	},
});

export default TOSscreen;
