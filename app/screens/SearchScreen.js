import React from "react";
import { StyleSheet, Text, useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";
import { InstantSearch, connectSearchBox } from "react-instantsearch-native";

import Screen from "../components/Screen";
import routes from "../navigations/routes";
import { sizing } from "../themes/presetStyles";
import colors from "../themes/colors";
import { searchClient } from "../InstantSearch/config";
import InfiniteHits from "../InstantSearch/InfiniteHits";
import SearchBox from "../components/SearchBox";

const RefineSearchBox = connectSearchBox(({ currentRefinement, refine }) => {
	const { t } = useTranslation([routes.screens.SEARCH]);
	return (
		<SearchBox
			autoFocus
			placeholder={t("searchPlaceholder")}
			value={currentRefinement}
			onChange={(text) => {
				refine(text);
			}}
		/>
	);
});

function SearchScreen({ navigation }) {
	const { t } = useTranslation([routes.screens.SEARCH]);
	const colorScheme = useColorScheme();

	const styles = StyleSheet.create({
		title: {
			fontSize: sizing(8),
			fontWeight: "600",
			color: colors(colorScheme).textPrimary,
			marginTop: sizing(14),
			marginBottom: sizing(2),
			paddingHorizontal: sizing(6),
		},
	});

	return (
		<Screen style={styles.container}>
			<InstantSearch indexName="resources" searchClient={searchClient}>
				<Text style={styles.title}>{t("title")}</Text>
				<RefineSearchBox />
				<InfiniteHits navigation={navigation} />
			</InstantSearch>
		</Screen>
	);
}

export default SearchScreen;
