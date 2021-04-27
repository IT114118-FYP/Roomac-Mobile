import React from "react";
import { useTranslation } from "react-i18next";
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	useColorScheme,
} from "react-native";
import Markdown from "react-native-markdown-display";
import colors from "../../themes/colors";

import presetStyles, { sizing } from "../../themes/presetStyles";

function TermsAndConditions({ tos }) {
	const { i18n } = useTranslation();
	const colorScheme = useColorScheme();

	return (
		<ScrollView>
			<Markdown
				style={{
					text: {
						fontSize: sizing(4),
						color: colors(colorScheme).textPrimary,
					},
					list_item: {
						flexDirection: "row",
						justifyContent: "flex-start",
						marginBottom: sizing(4),
						color: colors(colorScheme).textPrimary,
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

export default TermsAndConditions;
