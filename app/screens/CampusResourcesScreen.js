import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	ImageBackground,
	Text,
	ScrollView,
	StatusBar,
	Dimensions,
	ActivityIndicator,
	RefreshControl,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import * as Animatable from "react-native-animatable";

import routes from "../navigations/routes";
import colors from "../themes/colors";
import { sizing } from "../themes/presetStyles";
import SearchBox from "../components/SearchBox";
import { axiosInstance } from "../api/config";
import ResourceItem from "../components/ResourceItem";

const { height } = Dimensions.get("window");

const valuesToString = (object) =>
	Object.values(object).join(" ").toLowerCase();

function CampusResourcesScreen({ route, navigation }) {
	const { branch } = route.params;
	const { t, i18n } = useTranslation([
		routes.screens.CAMPUS_RESOURCES,
		"common",
	]);
	const translatedTitle = {
		en: branch.title_en,
		hk: branch.title_hk,
		cn: branch.title_cn,
	}[i18n.language];
	const [rawResources, setRawResources] = useState([]);
	const [resources, setResources] = useState([]);
	const [resourcesStrings, setResourcesStrings] = useState([]);
	const [isLoading, setLoading] = useState(true);

	const fetchResources = () => {
		setLoading(true);
		axiosInstance
			.get(`/api/resources?branch=${branch.id}`)
			.then(({ data }) => {
				const strings = data.map((item) => ({
					id: item.id,
					value: valuesToString(item),
				}));
				setResourcesStrings(strings);
				setRawResources(data);
				setResources(data);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	};

	const onSearch = (term) => {
		const results = resourcesStrings.filter((resource) =>
			resource.value.includes(term.toLowerCase())
		);
		const temp = rawResources.filter((resource) => {
			var has = false;
			results.forEach((result) => {
				if (resource.id == result.id) {
					has = true;
				}
			});
			return has;
		});
		setResources(temp);
	};

	useEffect(() => {
		fetchResources();
	}, []);

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={isLoading}
					onRefresh={fetchResources}
					title={t("common:pullToRefresh")}
				/>
			}
		>
			<StatusBar barStyle="light-content" animated={true} />
			<ImageBackground
				source={{ url: branch.image_url }}
				imageStyle={styles.image}
				style={styles.imageContainer}
			>
				<LinearGradient
					colors={["rgba(0, 0, 0, 0.7)", "rgba(0, 0, 0, 0.2)"]}
					style={styles.tint}
				>
					<Text style={styles.title}>
						{t("campusTitle", {
							value: translatedTitle,
						})}
					</Text>
				</LinearGradient>
			</ImageBackground>
			<View style={styles.container}>
				<SearchBox
					placeholder={t("searchPlaceholder", {
						value: translatedTitle,
					})}
					onChange={onSearch}
				/>
				<TouchableWithoutFeedback onPressIn={() => Keyboard.dismiss()}>
					<>
						{!isLoading &&
							resources.map((resource, index) => (
								<Animatable.View
									key={resource.id}
									animation={{
										0: {
											opacity: 0,
											scale: 0.7,
										},
										1: {
											opacity: 1,
											scale: 1,
										},
									}}
									duration={500}
									delay={400 + index * 125}
								>
									<ResourceItem
										item={resource}
										onPress={() =>
											navigation.navigate(
												routes.screens
													.DETAILED_RESOURCES,
												{ item: resource }
											)
										}
									/>
								</Animatable.View>
							))}
					</>
				</TouchableWithoutFeedback>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: sizing(4),
	},
	imageContainer: {
		height: height / 4,
	},
	tint: { flex: 1, justifyContent: "flex-end" },
	title: {
		fontSize: sizing(7),
		fontWeight: "bold",
		color: colors.backgroundPrimary,
		textShadowColor: colors.textPrimary,
		padding: sizing(6),
	},
});

export default CampusResourcesScreen;
