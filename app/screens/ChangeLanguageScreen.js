import React, { useState, useEffect } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import * as Localization from "expo-localization";

import Screen from "../components/Screen";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import {
	LanguageConfig,
	Translations,
	TranslationsStorage,
	useTranslation,
} from "../i18n";
import routes from "../navigations/routes";

const LanguageItem = ({ item, selected, onPress }) => (
	<TouchableOpacity
		onPress={onPress}
		style={[
			presetStyles.shadow,
			presetStyles.row,
			{
				paddingVertical: sizing(3),
				paddingHorizontal: sizing(4),
				marginTop: sizing(4),
				borderRadius: sizing(2),
				backgroundColor: selected
					? colors.Cyber_Grape
					: colors.backgroundPrimary,
			},
		]}
	>
		<Text
			style={{
				fontSize: sizing(4),
				color: selected ? colors.backgroundPrimary : colors.textPrimary,
				fontWeight: selected ? "600" : "400",
			}}
		>
			{item.label}
		</Text>
		{LanguageConfig.getModifiedKey(Localization.locale) === item.key && (
			<Text
				style={{
					fontSize: sizing(4),
					color: selected
						? colors.backgroundPrimary
						: colors.textSecondary,
					fontWeight: "300",
				}}
			>
				{Translations.getTranslatedString(
					"default",
					routes.screens.CHANGE_LANGUAGE
				)}
			</Text>
		)}
	</TouchableOpacity>
);

function ChangeLanguageScreen(props) {
	const { language, changeLanguage } = useTranslation();
	const [selected, setSelected] = useState(language);

	useEffect(() => {
		changeLanguage(selected);
	}, [selected]);

	return (
		<Screen>
			<ScrollView>
				<Text style={styles.title}>
					{Translations.getTranslatedString(
						"title",
						routes.screens.CHANGE_LANGUAGE
					)}
				</Text>
				<View style={presetStyles.marginHorizontal}>
					{LanguageConfig.LanguageOptions.map((item) => (
						<LanguageItem
							item={item}
							key={item.key}
							selected={selected.key === item.key ? true : false}
							onPress={() => {
								setSelected(item);
							}}
						/>
					))}
					<TouchableOpacity
						style={{
							paddingVertical: sizing(2),
							marginVertical: sizing(2),
						}}
					>
						<Text
							style={{
								color: colors.textSecondary,
								fontSize: sizing(3.5),
								fontWeight: "300",
							}}
						>
							{Translations.getTranslatedString(
								"reset",
								routes.screens.CHANGE_LANGUAGE
							)}
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
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

export default ChangeLanguageScreen;
