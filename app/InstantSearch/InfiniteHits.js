import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import { connectInfiniteHits } from "react-instantsearch-native";
import { useTranslation } from "react-i18next";

import routes from "../navigations/routes";
import { sizing } from "../themes/presetStyles";
import ResourceItem from "../components/ResourceItem";
import colors from "../themes/colors";
import branchesApi from "../api/branches";

const InfiniteHits = ({ hits, hasMore, refineNext, navigation }) => {
	const { t, i18n } = useTranslation([routes.screens.SEARCH]);
	const [branches_en, setBranches_en] = useState({});
	const [branches_hk, setBranches_hk] = useState({});
	const [branches_cn, setBranches_cn] = useState({});
	const [lat, setLat] = useState({});
	const [lng, setLng] = useState({});

	const fetchBranches = () => {
		branchesApi.fetchAll().then(({ data }) => {
			const en = {};
			const hk = {};
			const cn = {};
			const latitude = {};
			const longitude = {};
			data.forEach((item) => {
				en[item.id] = item.title_en;
				hk[item.id] = item.title_hk;
				cn[item.id] = item.title_cn;
				latitude[item.id] = item.lat;
				longitude[item.id] = item.lng;
			});
			setBranches_en(en);
			setBranches_hk(hk);
			setBranches_cn(cn);
			setLat(latitude);
			setLng(longitude);
		});
	};

	useEffect(() => {
		fetchBranches();
	}, []);

	return (
		<TouchableWithoutFeedback onPressIn={() => Keyboard.dismiss()}>
			<FlatList
				data={hits}
				keyExtractor={(item) => item.objectID}
				// ItemSeparatorComponent={() => <View style={styles.separator} />}
				onEndReached={() => hasMore && refineNext()}
				ListEmptyComponent={() => (
					<View
						style={{
							alignItems: "center",
							marginTop: sizing(6),
						}}
					>
						<Text
							style={{
								color: colors.textSecondary,
								fontSize: sizing(4),
							}}
						>
							{t("noResults")}
						</Text>
					</View>
				)}
				renderItem={({ item }) => (
					<View>
						<ResourceItem
							dense
							item={{
								image_url: item.image_url,
								title_en: item.title_en,
								title_hk: item.title_hk,
								title_cn: item.title_cn,
								branch: {
									title_en: branches_en[item.branch_id],
									title_hk: branches_hk[item.branch_id],
									title_cn: branches_cn[item.branch_id],
								},
								number: item.number,
								min_user: item.min_user,
								max_user: item.max_user,
								opening_time: item.opening_time,
								closing_time: item.closing_time,
							}}
							key={item.id}
							onPress={() =>
								navigation.navigate(
									routes.screens.DETAILED_RESOURCES,
									{
										item: {
											id: item.id,
											image_url: item.image_url,
											title_en: item.title_en,
											title_hk: item.title_hk,
											title_cn: item.title_cn,
											branch_id: item.branch_id,
											branch: {
												title_en:
													branches_en[item.branch_id],
												title_hk:
													branches_hk[item.branch_id],
												title_cn:
													branches_cn[item.branch_id],
												lat: lat[item.branch_id],
												lng: lng[item.branch_id],
											},
											number: item.number,
											min_user: item.min_user,
											max_user: item.max_user,
											opening_time: item.opening_time,
											closing_time: item.closing_time,
											tos_id: item.tos_id,
										},
									}
								)
							}
						/>
					</View>
				)}
			/>
		</TouchableWithoutFeedback>
	);
};

export default connectInfiniteHits(InfiniteHits);
