import React, { useEffect, useRef, useState } from "react";
import {
	View,
	StyleSheet,
	Image,
	Text,
	StatusBar,
	Platform,
	ScrollView,
	FlatList,
	Dimensions,
	TouchableOpacity,
	RefreshControl,
	Animated,
} from "react-native";
import * as Animatable from "react-native-animatable";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";

import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import Timeslot from "../components/Timeslot";
import { axiosInstance } from "../api/config";
import { getDistance } from "geolib";
import routes from "../navigations/routes";
import { Translations } from "../i18n";
const MAX_HEIGHT = 200;

const { width } = Dimensions.get("window");

const TIMESLOT_WIDTH = width * sizing(0.2);

function DetailedResourcesScreen({ route, navigation }) {
	const { item } = route.params;
	const [isLoading, setLoading] = useState(true);
	const [timeslot, setTimeslot] = useState({});
	const [distance, setDistance] = useState(null);
	const [location, setLocation] = useState();

	const getLocation = async () => {
		const { status } = await Location.requestPermissionsAsync();
		if (status !== "granted") return;
		const { coords } = await Location.getLastKnownPositionAsync({});
		const dist = getDistance(
			{
				latitude: Number(item.branch.lat),
				longitude: Number(item.branch.lng),
			},
			{
				latitude: coords.latitude,
				longitude: coords.longitude,
			}
		);
		setDistance(Math.round((dist / 1000 + Number.EPSILON) * 100) / 100);
	};

	useEffect(() => {
		getLocation();
		fetchTimeslot();
	}, []);

	const fetchTimeslot = () => {
		setLoading(true);
		const startDate = moment().format("YYYY-MM-DD");
		const endDate = moment().add(10, "days").format("YYYY-MM-DD");
		axiosInstance
			.get(
				`/api/resources/${item.id}/bookings?start=${startDate}&end=${endDate}`
			)
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
			});
	};

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={isLoading}
					onRefresh={fetchTimeslot}
					title="pull to refresh"
				/>
			}
		>
			<Image
				source={{
					uri: item.image_url,
				}}
				style={styles.image}
			/>
			<StatusBar barStyle="light-content" animated={true} />
			<View style={styles.detailContainer}>
				<Text style={styles.title}>{`${
					item.number
				} ${Translations.getTranslatedStringFromProvider({
					en: item.title_en,
					hk: item.title_hk,
					cn: item.title_cn,
				})}`}</Text>
			</View>
			<View style={presetStyles.marginHorizontal}>
				<View style={[presetStyles.row, { marginTop: sizing(1.5) }]}>
					<MaterialIcons
						name="location-on"
						size={sizing(4)}
						color={colors.textSecondary}
					/>
					<Text
						style={{
							color: colors.textSecondary,
							marginLeft: sizing(2),
						}}
					>
						{Translations.getTranslatedStringFromProvider({
							en: item.branch.title_en,
							hk: item.branch.title_hk,
							cn: item.branch.title_cn,
						})}
						{distance !== null &&
							Translations.getTranslatedString(
								"distance",
								routes.screens.DETAILED_RESOURCES,
								distance
							)}
					</Text>
				</View>
				<View style={[presetStyles.row, { marginTop: sizing(1.5) }]}>
					<MaterialCommunityIcons
						name="clock"
						size={sizing(4)}
						color={colors.textSecondary}
					/>
					<Text
						style={{
							color: colors.textSecondary,
							marginLeft: sizing(1.5),
						}}
					>
						{moment(item.opening_time, "HH:mm:ss").format("H:mm")} -{" "}
						{moment(item.closing_time, "HH:mm:ss").format("H:mm")} •{" "}
						{moment().isBetween(
							moment(item.opening_time, "HH:mm:ss"),
							moment(item.closing_time, "HH:mm:ss")
						)
							? Translations.getTranslatedString(
									"opened",
									routes.screens.DETAILED_RESOURCES
							  )
							: Translations.getTranslatedString(
									"closed",
									routes.screens.DETAILED_RESOURCES
							  )}
					</Text>
				</View>
				<View style={[presetStyles.row, { marginTop: sizing(2) }]}>
					<MaterialCommunityIcons
						name="account-multiple"
						size={sizing(4)}
						color={colors.textSecondary}
						style={styles.icon}
					/>
					<Text
						style={{
							color: colors.textSecondary,
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
							},
						]}
					>
						{Translations.getTranslatedString(
							"availability",
							routes.screens.DETAILED_RESOURCES
						)}
					</Animatable.Text>
					<Animatable.Text
						animation="fadeIn"
						style={[
							styles.marginHorizontal,
							{
								marginTop: sizing(1),
								color: colors.textSecondary,
							},
						]}
					>
						{Translations.getTranslatedString(
							"availabilityDescriptoin",
							routes.screens.DETAILED_RESOURCES
						)}
					</Animatable.Text>
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
									data={flatlistItem}
									navigation={navigation}
									onPress={(timeslot) =>
										navigation.navigate(
											routes.screens.CREATE_BOOKING,
											{
												timeslot,
												item,
												date: flatlistItem.date,
											}
										)
									}
								/>
							</Animatable.View>
						)}
					/>
				</>
			)}
			<Text
				style={[
					presetStyles.marginHorizontal,
					presetStyles.listHeader,
					{
						marginTop: sizing(6),
					},
				]}
			>
				{Translations.getTranslatedString(
					"campusLocation",
					routes.screens.DETAILED_RESOURCES,
					Translations.getTranslatedStringFromProvider({
						en: item.branch.title_en,
						hk: item.branch.title_hk,
						cn: item.branch.title_cn,
					})
				)}
			</Text>
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
						title={Translations.getTranslatedStringFromProvider({
							en: item.branch.title_en,
							hk: item.branch.title_hk,
							cn: item.branch.title_cn,
						})}
					/>
				</MapView>
			</View>
			<TouchableOpacity
				onPress={() => {
					console.log(location);
				}}
				style={[
					presetStyles.marginHorizontal,
					presetStyles.row,
					{
						alignItems: "center",
						marginVertical: sizing(6),
						borderWidth: 1,
						borderRadius: sizing(2),
						borderColor: colors.textSecondary,
						padding: sizing(4),
					},
				]}
			>
				<MaterialCommunityIcons
					name="message-text"
					size={sizing(6)}
					color={colors.textSecondary}
					style={{
						marginRight: sizing(4),
					}}
				/>
				<View style={{ flex: 1 }}>
					<Text
						style={[
							presetStyles.listHeader,
							{
								color: colors.textPrimary,
							},
						]}
					>
						{Translations.getTranslatedString(
							"contactAdmin",
							routes.screens.DETAILED_RESOURCES
						)}
					</Text>
					<Text
						style={{
							color: colors.textSecondary,
						}}
					>
						{Translations.getTranslatedString(
							"contactAdminDescription",
							routes.screens.DETAILED_RESOURCES
						)}
					</Text>
				</View>
				<MaterialCommunityIcons
					name="chevron-right"
					size={sizing(6)}
					color={colors.textSecondary}
				/>
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
	},
	marginHorizontal: {
		marginHorizontal: sizing(6),
	},
	mapContainer: {
		alignItems: "center",
		marginHorizontal: sizing(6),
		marginVertical: sizing(3),
	},
});

export default DetailedResourcesScreen;
