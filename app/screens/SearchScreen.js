import React from "react";
import { StyleSheet, Text } from "react-native";
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

const styles = StyleSheet.create({
	container: {},
	title: {
		fontSize: sizing(8),
		fontWeight: "600",
		color: colors.Oxford_Blue,
		marginTop: sizing(14),
		marginBottom: sizing(2),
		paddingHorizontal: sizing(6),
	},
	searchIcon: {
		margin: 2,
		marginRight: 8,
	},
	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.backgroundPrimary,
		borderRadius: sizing(2),
		paddingHorizontal: sizing(3),
		marginVertical: sizing(2),
		marginHorizontal: sizing(6),
	},
	searchInput: {
		flex: 1,
		paddingVertical: sizing(3),
	},
});

export default SearchScreen;
