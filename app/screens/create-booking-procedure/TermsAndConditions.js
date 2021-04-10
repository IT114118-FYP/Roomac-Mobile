import React from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";

import presetStyles, { sizing } from "../../themes/presetStyles";

function TermsAndConditions({ tos }) {
	const { i18n } = useTranslation();
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
				{
					{
						en: tos.tos_en,
						hk: tos.tos_hk,
						cn: tos.tos_cn,
					}[i18n.language]
				}
			</Markdown>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default TermsAndConditions;
