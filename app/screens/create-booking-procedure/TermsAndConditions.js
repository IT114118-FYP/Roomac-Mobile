import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";

import presetStyles, { sizing } from "../../themes/presetStyles";

function TermsAndConditions({ tos }) {
	return (
		<ScrollView style={styles.container}>
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
				{tos.tos_en}
			</Markdown>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default TermsAndConditions;
