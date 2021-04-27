import moment from "moment";
import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	Image,
	Dimensions,
	ScrollView,
	StatusBar,
	Modal,
	RefreshControl,
	Alert,
	Button as DefaultButton,
	useColorScheme,
} from "react-native";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import Markdown from "react-native-markdown-display";
import Button from "../components/Button";
import routes from "../navigations/routes";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckInScreen from "./CheckInScreen";
import resourcesApi from "../api/resources";
import bookingsApi from "../api/bookings";
import branchesApi from "../api/branches";
import MapView, { Marker } from "react-native-maps";

const { width, height } = Dimensions.get("screen");

function BookingDetailsScreen({ route, navigation }) {
	const { item: itemData, checkInClicked } = route.params;
	const colorScheme = useColorScheme();
	const { t, i18n } = useTranslation([
		routes.screens.BOOKING_DETAILS,
		"common",
	]);
	const [item, setItem] = useState(itemData);
	const [branch, setBranch] = useState();
	const [isLoading, setLoading] = useState(false);
	const [tos, setTos] = useState();
	const [isCheckInClicked, setCheckInClicked] = useState(
		Boolean(checkInClicked)
	);

	const fetchTOS = () => {
		resourcesApi
			.fetchTOS(itemData.resource.tos_id)
			.then(({ data }) => {
				setTos(data);
			})
			.catch((error) => console.log(error));
	};

	const fetchBooking = () => {
		setLoading(true);
		bookingsApi
			.fetchOne(item.id)
			.then(({ data }) => setItem(data))
			.catch(console.log)
			.finally(() => setLoading(false));
	};

	const fetchBranch = () =>
		branchesApi
			.fetchOne(item.resource.branch_id)
			.then(({ data }) => setBranch(data))
			.catch(console.log);

	const onEditHandler = () => {
		Alert.alert(t("editTitle"), t("editDescription"), [
			{
				text: t("continue"),
				onPress: () => {
					const resource = item.resource;
					resource["tos"] = tos;
					navigation.navigate(routes.screens.CREATE_BOOKING, {
						timeslot: {
							start: moment(item.start_time).format("HH:mm:ss"),
							end: moment(item.end_time).format("HH:mm:ss"),
						},
						item: resource,
						date: moment(item.start_time).format("YYYY-MM-DD"),
						// dataSet: datasetData,
						bookingId: item.id,
						edit: true,
					});
				},
			},
			{
				text: t("cancel"),
				style: "destructive",
				onPress: () =>
					Alert.alert(t("cancel"), t("cancelDescription"), [
						{
							text: t("cancel"),
							style: "destructive",
							onPress: () => {
								deleteBooking();
							},
						},
						{
							text: t(routes.screens.SETTINGS + ":cancel"),
							style: "cancel",
						},
					]),
			},
			{
				text: t(routes.screens.SETTINGS + ":cancel"),
				style: "cancel",
			},
		]);
	};

	const deleteBooking = () => {
		setLoading(true);
		bookingsApi
			.deleteOne(item.id)
			.then(() => {
				navigation.goBack();
			})
			.catch((error) => {
				console.log(error);
				alert(t("common:failed"));
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchTOS();
		fetchBranch();
	}, []);

	const styles = StyleSheet.create({
		container: {
			backgroundColor: colors(colorScheme).backgroundPrimary,
		},
		image: {
			width,
			height: height * 0.3,
		},
		date: {
			fontSize: sizing(4),
			paddingTop: sizing(6),
			fontWeight: "400",
			color: colors(colorScheme).textSecondary,
		},
		time: {
			fontSize: sizing(6),
			paddingTop: sizing(1),
			fontWeight: "800",
			color: colors(colorScheme).textPrimary,
		},
		title: {
			fontSize: sizing(7),
			paddingTop: sizing(1),
			fontWeight: "500",
			color: colors(colorScheme).textPrimary,
		},
		capacity: {
			fontSize: sizing(4),
			color: colors(colorScheme).textSecondary,
			marginLeft: sizing(2),
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

	return (
		<ScrollView
			style={styles.container}
			refreshControl={
				<RefreshControl
					refreshing={isLoading}
					onRefresh={fetchBooking}
					title={t("common:pullToRefresh")}
				/>
			}
		>
			<StatusBar barStyle="light-content" animated={true} />
			<Image
				source={{ uri: itemData.resource.image_url }}
				style={styles.image}
			/>
			<Text style={[presetStyles.marginHorizontal, styles.date]}>
				{moment(item.start_time).format(
					{
						en: "LL",
						hk: "YYYY年MM月DD日",
						cn: "YYYY年MM月DD日",
					}[i18n.language]
				)}
			</Text>

			<Text
				adjustsFontSizeToFit
				numberOfLines={1}
				style={[presetStyles.marginHorizontal, styles.time]}
			>
				{`${moment(item.start_time).format("H:mm")} - ${moment(
					item.end_time
				).format("H:mm")}`}
			</Text>
			<Text
				adjustsFontSizeToFit
				numberOfLines={1}
				style={[presetStyles.marginHorizontal, styles.title]}
			>
				{Boolean(
					{
						en: itemData.resource.title_en,
						hk: itemData.resource.title_hk,
						cn: itemData.resource.title_cn,
					}[i18n.language]
				)
					? `${itemData.resource.number} • ${
							{
								en: itemData.resource.title_en,
								hk: itemData.resource.title_hk,
								cn: itemData.resource.title_cn,
							}[i18n.language]
					  }`
					: itemData.resource.number}
			</Text>
			<View style={presetStyles.marginHorizontal}>
				<View style={[presetStyles.row, { marginTop: sizing(2) }]}>
					<MaterialCommunityIcons
						name="account-multiple"
						size={sizing(4)}
						color={colors(colorScheme).textSecondary}
						style={styles.icon}
					/>
					<Text
						style={styles.capacity}
					>{`${itemData.resource.min_user} - ${itemData.resource.max_user}`}</Text>
				</View>
			</View>
			{moment(item.end_time).isAfter(moment()) ? (
				<View
					style={[
						presetStyles.marginHorizontal,
						presetStyles.row,
						{
							marginVertical: sizing(4),
						},
					]}
				>
					{!moment().isBetween(
						moment(item.start_time),
						moment(item.end_time)
					) && (
						<Button
							style={{
								marginRight: sizing(3),
								backgroundColor: colors(colorScheme)
									.Light_Orange,
							}}
							onPress={onEditHandler}
						>
							<MaterialIcons
								name="edit"
								size={sizing(5)}
								color={colors().backgroundPrimary}
							/>
						</Button>
					)}
					<Button
						title={
							moment().isBetween(
								moment(item.start_time).subtract(15, "minutes"),
								moment(item.end_time)
							)
								? item.checkin_time == null
									? moment().isAfter(
											moment(item.start_time).add(15, "m")
									  )
										? t("common:lateCheckIn", {
												value: moment().diff(
													moment(item.start_time),
													"m"
												),
										  })
										: t("checkIn")
									: t(
											moment().isAfter(
												moment(item.start_time).add(
													15,
													"m"
												)
											)
												? "common:late"
												: "common:checkedIn",
											{
												value: moment(
													item.checkin_time
												).format("HH:mm"),
											}
									  )
								: t("checkInAvailable", {
										value: moment(item.start_time)
											.subtract(15, "minutes")
											.format("H:mm"),
								  })
						}
						style={{ flex: 1 }}
						titleStyle={{ color: colors().backgroundPrimary }}
						onPress={() => setCheckInClicked(true)}
						disabled={
							moment().isBetween(
								moment(item.start_time).subtract(15, "minutes"),
								moment(item.end_time)
							)
								? item.checkin_time == null
									? false
									: true
								: true
						}
					/>
				</View>
			) : (
				<View
					style={[
						presetStyles.marginHorizontal,
						{ marginTop: sizing(4) },
					]}
				>
					<Text
						style={[
							presetStyles.listHeader,
							{ color: colors(colorScheme).textPrimary },
						]}
					>
						{t("status")}
					</Text>
					<Text
						style={{
							marginTop: sizing(1),
							fontSize: sizing(6),
							color: colors(colorScheme).textPrimary,
							fontWeight: "bold",
							color:
								item.checkin_time == null
									? "red"
									: moment(item.checkin_time).isAfter(
											moment(item.start_time).add(15, "m")
									  )
									? colors(colorScheme).Light_Orange
									: "teal",
						}}
					>
						{item.checkin_time != null
							? t(
									moment(item.checkin_time).isAfter(
										moment(item.start_time).add(15, "m")
									)
										? "common:late"
										: "common:checkedIn",
									{
										value: moment(item.checkin_time).format(
											"HH:mm"
										),
									}
							  )
							: t("common:notCheckIn")}
					</Text>
				</View>
			)}
			{tos && (
				<View
					style={[
						presetStyles.marginHorizontal,
						{
							marginTop: sizing(4),
						},
					]}
				>
					<Text
						style={[
							presetStyles.listHeader,
							{
								marginBottom: sizing(4),
								color: colors(colorScheme).textPrimary,
							},
						]}
					>
						{t("tos")}
					</Text>
					<Markdown
						style={{
							text: {
								fontSize: sizing(4),
								color: colors(colorScheme).textSecondary,
							},
							list_item: {
								color: colors(colorScheme).textSecondary,
								flexDirection: "row",
								justifyContent: "flex-start",
								marginBottom: sizing(4),
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
				</View>
			)}
			{branch && (
				<>
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
								{
									flex: 1,
									color: colors(colorScheme).textPrimary,
								},
							]}
						>
							{t(
								routes.screens.DETAILED_RESOURCES +
									":campusLocation",
								{
									value: {
										en: branch.title_en,
										hk: branch.title_hk,
										cn: branch.title_cn,
									}[i18n.language],
								}
							)}
						</Text>
						<DefaultButton
							title={t(
								routes.screens.DETAILED_RESOURCES + ":resources"
							)}
							onPress={() =>
								navigation.navigate(
									routes.screens.CAMPUS_RESOURCES,
									{
										branch,
									}
								)
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
								latitude: Number(branch.lat),
								longitude: Number(branch.lng),
								latitudeDelta: 0.0922,
								longitudeDelta: 0.0421,
							}}
						>
							<Marker
								coordinate={{
									latitude: Number(branch.lat),
									longitude: Number(branch.lng),
								}}
								title={
									{
										en: branch.title_en,
										hk: branch.title_hk,
										cn: branch.title_cn,
									}[i18n.language]
								}
							/>
						</MapView>
					</View>
				</>
			)}

			{isCheckInClicked && (
				<Modal
					visible={isCheckInClicked}
					animationType="slide"
					presentationStyle="pageSheet"
				>
					<SafeAreaView>
						<CheckInScreen
							onClose={() => setCheckInClicked(false)}
							bookingId={item.id}
							date={`${moment(item.start_time).format(
								{
									en: "LL",
									hk: "YYYY年MM月DD日",
									cn: "YYYY年MM月DD日",
								}[i18n.language]
							)}`}
							time={`${moment(item.start_time).format(
								"H:mm"
							)} - ${moment(item.end_time).format("H:mm")}${
								Boolean(itemData.resource.title_en) &&
								" • " +
									{
										en: itemData.resource.title_en,
										hk: itemData.resource.title_hk,
										cn: itemData.resource.title_cn,
									}[i18n.language]
							}`}
						/>
					</SafeAreaView>
				</Modal>
			)}
		</ScrollView>
	);
}

export default BookingDetailsScreen;
