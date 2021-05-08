import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	StatusBar,
	ScrollView,
	FlatList,
	Dimensions,
	RefreshControl,
	Button,
	ImageBackground,
	useColorScheme,
} from "react-native";
import * as Animatable from "react-native-animatable";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";

import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import Timeslot from "../components/Timeslot";
import { getDistance } from "geolib";
import routes from "../navigations/routes";
import { useTranslation } from "react-i18next";
import resourcesApi from "../api/resources";
import AvailabilityIndicator from "../components/AvailabilityIndicator";

const { width, height } = Dimensions.get("window");

const MAX_HEIGHT = height / 3.5;
const TIMESLOT_WIDTH = width * sizing(0.2);

function DetailedResourcesScreen({ route, navigation }) {
	const { t, i18n } = useTranslation([routes.screens.DETAILED_RESOURCES]);
	const { item } = route.params;
	const colorScheme = useColorScheme();
	const [isLoading, setLoading] = useState(true);
	const [timeslot, setTimeslot] = useState({});
	const [distance, setDistance] = useState(null);

	// const getLocation = async () => {
	// 	const { status } = await Location.requestPermissionsAsync();
	// 	if (status !== "granted") return;
	// 	const { coords } = await Location.getLastKnownPositionAsync({});
	// 	const dist = getDistance(
	// 		{
	// 			latitude: Number(item.branch.lat),
	// 			longitude: Number(item.branch.lng),
	// 		},
	// 		{
	// 			latitude: coords.latitude,
	// 			longitude: coords.longitude,
	// 		}
	// 	);
	// 	setDistance(Math.round((dist / 1000 + Number.EPSILON) * 100) / 100);
	// };

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors(colorScheme).backgroundPrimary,
		},
		detailContainer: {
			marginHorizontal: sizing(6),
			marginTop: sizing(4),
			flexDirection: "row",
		},
		image: {
			height: MAX_HEIGHT,
			resizeMode: "cover",
		},
		title: {
			fontSize: 24,
			fontWeight: "500",
			// margin: 15,
			flex: 1,
			color: colors(colorScheme).textPrimary,
		},
		marginHorizontal: {
			marginHorizontal: sizing(6),
		},
		mapContainer: {
			alignItems: "center",
			marginHorizontal: sizing(6),
			marginVertical: sizing(3),
		},
		tint: { flex: 1, justifyContent: "flex-end" },
	});

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			// The screen is focused
			// Call any action
			// getLocation();
			fetchTimeslot();
		});

		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe;
	}, [navigation]);

	const fetchTimeslot = () => {
		setLoading(true);
		const startDate = moment().format("YYYY-MM-DD");
		const endDate = moment().add(10, "days").format("YYYY-MM-DD");

		resourcesApi
			.fetchTimeslots(item.id, startDate, endDate)
			.then(({ data }) => {
				let events = [];
				for (let i in data.allow_times) {
					let allow_time = data.allow_times[i];
					for (let date in allow_time) {
						let times = allow_time[date];
						let eventSlot = [];
						for (let j in times) {
							eventSlot.push({
								id: times[j].id,
								start: times[j].start_time,
								end: times[j].end_time,
								available: times[j].available,
							});
						}
						events.push({
							date: date,
							timeslot: eventSlot,
						});
					}
				}
				setTimeslot(events);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => setLoading(false));
	};

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={isLoading}
					onRefresh={fetchTimeslot}
					title={t("common:pullToRefresh")}
				/>
			}
			style={styles.container}
		>
			<ImageBackground
				source={{
					uri: item.image_url,
				}}
				style={styles.image}
			>
				<LinearGradient
					colors={["rgba(0, 0, 0, 0.4)", "transparent"]}
					style={styles.tint}
				></LinearGradient>
			</ImageBackground>
			<StatusBar barStyle="light-content" animated={true} />
			<View style={styles.detailContainer}>
				<Text style={styles.title}>{`${item.number} ${
					Boolean(
						{
							en: item.title_en,
							hk: item.title_hk,
							cn: item.title_cn,
						}[i18n.language]
					)
						? {
								en: item.title_en,
								hk: item.title_hk,
								cn: item.title_cn,
						  }[i18n.language]
						: ""
				}`}</Text>
			</View>
			<View style={presetStyles.marginHorizontal}>
				<View style={[presetStyles.row, { marginTop: sizing(1.5) }]}>
					<MaterialIcons
						name="location-on"
						size={sizing(4)}
						color={colors(colorScheme).textSecondary}
					/>
					<Text
						style={{
							color: colors(colorScheme).textSecondary,
							marginLeft: sizing(2),
						}}
					>
						{
							{
								en: item.branch.title_en,
								hk: item.branch.title_hk,
								cn: item.branch.title_cn,
							}[i18n.language]
						}
						{/* {distance !== null &&
							t("distance", { value: distance })} */}
					</Text>
				</View>
				<View style={[presetStyles.row, { marginTop: sizing(1.5) }]}>
					<MaterialCommunityIcons
						name="clock"
						size={sizing(4)}
						color={colors(colorScheme).textSecondary}
					/>
					<Text
						style={{
							color: colors(colorScheme).textSecondary,
							marginLeft: sizing(1.5),
						}}
					>
						{moment(item.opening_time, "HH:mm:ss").format("H:mm")} -{" "}
						{moment(item.closing_time, "HH:mm:ss").format("H:mm")} •{" "}
						{moment().isBetween(
							moment(item.opening_time, "HH:mm:ss"),
							moment(item.closing_time, "HH:mm:ss")
						)
							? t("opened")
							: t("closed")}
					</Text>
				</View>
				<View style={[presetStyles.row, { marginTop: sizing(2) }]}>
					<MaterialCommunityIcons
						name="account-multiple"
						size={sizing(4)}
						color={colors(colorScheme).textSecondary}
						style={styles.icon}
					/>
					<Text
						style={{
							color: colors(colorScheme).textSecondary,
							marginLeft: sizing(2),
						}}
					>{`${item.min_user} - ${item.max_user}`}</Text>
				</View>
			</View>
			{!isLoading && (
				<>
					<Animatable.Text
						animation="fadeIn"
						style={[
							presetStyles.listHeader,
							styles.marginHorizontal,
							{
								marginTop: sizing(4),
								color: colors(colorScheme).textPrimary,
							},
						]}
					>
						{t("availability")}
					</Animatable.Text>
					<Animatable.Text
						animation="fadeIn"
						style={[
							styles.marginHorizontal,
							{
								marginTop: sizing(1),
								color: colors(colorScheme).textSecondary,
							},
						]}
					>
						{t("availabilityDescriptoin")}
					</Animatable.Text>
					<View
						style={[
							presetStyles.marginHorizontal,
							presetStyles.row,
							{
								justifyContent: "flex-end",
								marginTop: sizing(2),
							},
						]}
					>
						{[
							{ color: "#32cd80", availability: t("available") },
							{ color: "#d24747", availability: t("booked") },
							{
								color: colors(colorScheme).textSecondary,
								availability: t("past"),
							},
						].map((item, index) => (
							<AvailabilityIndicator
								key={index}
								color={item.color}
								availability={item.availability}
							/>
						))}
					</View>
					<FlatList
						horizontal
						snapToInterval={TIMESLOT_WIDTH + sizing(6)}
						decelerationRate="fast"
						showsHorizontalScrollIndicator={false}
						pagingEnabled
						data={timeslot}
						keyExtractor={(item) => `${item.date}`}
						renderItem={({ item: flatlistItem, index }) => (
							<Animatable.View
								style={styles.wrapper}
								animation={{
									0: {
										opacity: 0,
									},
									1: {
										opacity: 1,
									},
								}}
								delay={index * 150 + 100}
								key={flatlistItem.id}
							>
								<Timeslot
									// selectable={false}
									data={flatlistItem}
									navigation={navigation}
									onPress={(time) =>
										navigation.navigate(
											routes.screens.CREATE_BOOKING,
											{
												timeslot: time,
												item,
												date: flatlistItem.date,
												dataSet: timeslot,
											}
										)
									}
								/>
							</Animatable.View>
						)}
					/>
				</>
			)}
			<View
				style={[
					presetStyles.marginHorizontal,
					presetStyles.row,
					{
						marginTop: sizing(6),
					},
				]}
			>
				<Text
					style={[
						presetStyles.listHeader,
						{ flex: 1, color: colors(colorScheme).textPrimary },
					]}
				>
					{t("campusLocation", {
						value: {
							en: item.branch.title_en,
							hk: item.branch.title_hk,
							cn: item.branch.title_cn,
						}[i18n.language],
					})}
				</Text>
				<Button
					title={t("resources")}
					onPress={() =>
						navigation.navigate(routes.screens.CAMPUS_RESOURCES, {
							branch: item.branch,
						})
					}
				/>
			</View>
			<View style={styles.mapContainer}>
				<MapView
					// scrollEnabled={false}
					showsUserLocation
					style={{
						width: "100%",
						height: 200,
					}}
					initialRegion={{
						latitude: Number(item.branch.lat),
						longitude: Number(item.branch.lng),
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				>
					<Marker
						coordinate={{
							latitude: Number(item.branch.lat),
							longitude: Number(item.branch.lng),
						}}
						title={
							{
								en: item.branch.title_en,
								hk: item.branch.title_hk,
								cn: item.branch.title_cn,
							}[i18n.language]
						}
					/>
				</MapView>
			</View>
		</ScrollView>
	);
}

export default DetailedResourcesScreen;
