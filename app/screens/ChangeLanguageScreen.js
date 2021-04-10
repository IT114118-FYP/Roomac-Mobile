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
import routes from "../navigations/routes";
import { useTranslation } from "react-i18next";
import { storeLanguagePreference } from "../i18n/func";

const LanguageOptions = [
	{
		id: 1,
		key: "en",
		label: "English",
	},
	{
		id: 2,
		key: "hk",
		label: "繁體中文",
	},
	{
		id: 3,
		key: "cn",
		label: "簡体中文",
	},
];

const LanguageItem = ({ item, selected, onPress }) => {
	const { t, i18n } = useTranslation([routes.screens.CHANGE_LANGUAGE]);
	return (
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
					color: selected
						? colors.backgroundPrimary
						: colors.textPrimary,
					fontWeight: selected ? "600" : "400",
				}}
			>
				{item.label}
			</Text>

			{Localization.locale.substring(0, 2) === "zh"
				? Localization.locale.includes("Hant")
					? "hk"
					: "cn"
				: "en" === item.key && (
						<Text
							style={{
								fontSize: sizing(4),
								color: selected
									? colors.backgroundPrimary
									: colors.textSecondary,
								fontWeight: "300",
							}}
						>
							{t("default")}
						</Text>
				  )}
		</TouchableOpacity>
	);
};

function ChangeLanguageScreen(props) {
	const { t, i18n } = useTranslation([routes.screens.CHANGE_LANGUAGE]);
	const [selected, setSelected] = useState(
		LanguageOptions.find((lang) => lang.key === i18n.language)
	);

	useEffect(() => {
		i18n.changeLanguage(selected.key);
		storeLanguagePreference(selected);
	}, [selected]);

	return (
		<Screen>
			<ScrollView>
				<Text style={styles.title}>{t("title")}</Text>
				<View style={presetStyles.marginHorizontal}>
					{LanguageOptions.map((item) => (
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
								fontSize: sizing(4),
								fontWeight: "300",
							}}
						>
							{t("reset")}
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
