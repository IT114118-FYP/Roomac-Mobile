import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";
import { Translations } from "../../i18n";

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
				{Translations.getTranslatedStringFromProvider({
					en: tos.tos_en,
					hk: tos.tos_hk,
					cn: tos.tos_cn,
				})}
			</Markdown>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default TermsAndConditions;
