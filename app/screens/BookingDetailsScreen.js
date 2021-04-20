import moment from "moment";
import React from "react";
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
} from "react-native";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import { axiosInstance } from "../api/config";
import { useState } from "react";
import { useEffect } from "react";
import Markdown from "react-native-markdown-display";
import Button from "../components/Button";
import routes from "../navigations/routes";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckInScreen from "./CheckInScreen";
import resourcesApi from "../api/resources";
import bookingsApi from "../api/bookings";

const { width, height } = Dimensions.get("screen");

function BookingDetailsScreen({ route, navigation }) {
	const { item: itemData, checkInClicked } = route.params;
	const { t, i18n } = useTranslation([
		routes.screens.BOOKING_DETAILS,
		"common",
	]);
	const [item, setItem] = useState(itemData);
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

	useEffect(() => {
		fetchTOS();
	}, []);

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
				{Boolean(itemData.resource.title_en)
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
						color={colors.textSecondary}
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
					<Button
						style={{
							marginRight: sizing(3),
							backgroundColor: colors.Light_Orange,
						}}
						onPress={() => {
							Alert.alert(t("editTitle"), t("editDescription"), [
								{
									text: t(
										routes.screens.SETTINGS + ":cancel"
									),
									style: "cancel",
								},
								{
									text: t("continue"),
									onPress: () =>
										navigation.replace(
											routes.screens.EDIT_BOOKING
										),
								},
							]);
						}}
					>
						<MaterialIcons
							name="edit"
							size={sizing(6)}
							color={colors.backgroundPrimary}
						/>
					</Button>
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
					<Text style={presetStyles.listHeader}>{t("status")}</Text>
					<Text
						style={{
							fontSize: sizing(6),
							color: colors.textPrimary,
							fontWeight: "bold",
							color:
								item.checkin_time == null
									? "red"
									: moment(item.checkin_time).isAfter(
											moment(item.start_time).add(15, "m")
									  )
									? colors.Light_Orange
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
							},
						]}
					>
						{t("tos")}
					</Text>
					<Markdown
						style={{
							text: {
								fontSize: sizing(4),
								color: colors.textSecondary,
							},
							list_item: {
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

const styles = StyleSheet.create({
	container: {},
	image: {
		width,
		height: height * 0.3,
	},
	date: {
		fontSize: sizing(4),
		paddingTop: sizing(6),
		fontWeight: "400",
		color: colors.textSecondary,
	},
	time: {
		fontSize: sizing(6),
		paddingTop: sizing(1),
		fontWeight: "800",
		color: colors.textSecondary,
	},
	title: {
		fontSize: sizing(7),
		paddingTop: sizing(1),
		fontWeight: "500",
	},
	capacity: {
		fontSize: sizing(4),
		color: colors.textSecondary,
		marginLeft: sizing(2),
	},
});

export default BookingDetailsScreen;
