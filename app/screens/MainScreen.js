import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Modal,
	FlatList,
	RefreshControl,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import moment from "moment";

import { useTranslation } from "react-i18next";
import CategoryItem from "../components/CategoryItem";
import Screen from "../components/Screen";
import ResourceItem from "../components/ResourceItem";
import ViewBookingListItem from "../components/ViewBookingListItem";
import useAuth from "../auth/useAuth";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import routes from "../navigations/routes";
import CampusItem from "../components/CampusItem";
import axios from "axios";
import branchesApi from "../api/branches";
import categoriesApi from "../api/categories";
import resourcesApi from "../api/resources";
import bookingsApi from "../api/bookings";

function MainScreen({ navigation }) {
	const { user } = useAuth();
	const { t, i18n } = useTranslation([routes.screens.HOME, "common"]);

	const [isLoading, setLoading] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(1);
	const [activeBooking, setActiveBooking] = useState(null);
	const [upcoming, setUpcoming] = useState([]);
	const [categories, setCategories] = useState([]);
	const [resources, setResources] = useState([]);
	const [branches, setBranches] = useState([]);
	const [isCampusOpen, setCampusOpen] = useState(false);

	const getBookings = () =>
		bookingsApi
			.fetchFromUser(
				user.id,
				moment().format("YYYY-MM-DD"),
				moment().format("YYYY-MM-DD")
			)
			.then(({ data }) => {
				//bookings
				const current = moment();
				var upcomingData = [];
				data.forEach((booking) => {
					if (
						moment().isBetween(booking.start_time, booking.end_time)
					) {
						setActiveBooking(booking);
					} else if (moment(booking.start_time).isAfter(current)) {
						upcomingData.push(booking);
					}
				});
				upcomingData.sort((a, b) =>
					moment(a.start_time).isAfter(moment(b.start_time))
				);
				setUpcoming(upcomingData);
			})
			.catch((error) => console.log(error));

	const fetchAllData = async () => {
		setLoading(true);
		try {
			const [categoriesData, branchesData] = await axios.all([
				categoriesApi.fetchAll(),
				branchesApi.fetchAll(),
			]);
			//categories
			setCategories(categoriesData.data);
			setSelectedCategory(categoriesData.data[0].id);
			//branches
			setBranches(branchesData.data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		resourcesApi.fetchFromCategory(selectedCategory).then(({ data }) => {
			setResources(data);
		});
	}, [selectedCategory]);

	useEffect(() => {
		fetchAllData();
	}, []);

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			// The screen is focused
			// Call any action
			getBookings();
		});
		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe;
	}, [navigation]);

	return (
		<Screen style={styles.container}>
			<View
				style={[
					presetStyles.row,
					{
						marginBottom: sizing(2.5),
						marginLeft: sizing(6),
						paddingTop: sizing(6),
					},
				]}
			>
				<TouchableOpacity
					style={styles.drawerToggle}
					onPress={navigation.toggleDrawer}
				>
					<Feather
						name="menu"
						color={colors.textPrimary}
						size={sizing(5.5)}
					/>
				</TouchableOpacity>
				<Text style={styles.username}>
					{t("welcome", {
						value: {
							en: user.first_name,
							hk: user.chinese_name,
							cn: user.chinese_name,
						}[i18n.language],
					})}
				</Text>
			</View>
			<TouchableOpacity
				style={[styles.searchBar, presetStyles.shadow]}
				onPress={() => navigation.navigate(routes.screens.SEARCH)}
			>
				<Feather
					name="search"
					size={16}
					color={colors.textSecondary}
					style={styles.searchIcon}
				/>
				<Text
					style={{
						color: colors.textSecondary,
					}}
				>
					{t("searchTitle")}
				</Text>
			</TouchableOpacity>
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={isLoading}
						onRefresh={() => {
							fetchAllData();
							getBookings();
						}}
						title={t("common:pullToRefresh")}
					/>
				}
			>
				{(upcoming.length !== 0 || activeBooking) && (
					<View
						style={[
							presetStyles.marginHorizontal,
							{
								marginVertical: sizing(4),
							},
						]}
					>
						{activeBooking && (
							<View
								style={{
									marginBottom: sizing(4),
								}}
							>
								<Text
									style={[
										presetStyles.listHeader,
										{
											marginBottom: sizing(2),
										},
									]}
								>
									{t("common:now")}
								</Text>

								<Animatable.View animation="fadeInRight">
									<ViewBookingListItem
										active
										// onCheckIn
										date={moment(
											activeBooking.start_time
										).format(
											{
												en: "LL",
												hk: "YYYY年MM月DD日",
												cn: "YYYY年MM月DD日",
											}[i18n.language]
										)}
										period={`${moment(
											activeBooking.start_time
										).format("H:mm")} - ${moment(
											activeBooking.end_time
										).format("H:mm")}`}
										location={
											Boolean(
												activeBooking.resource.title_en
											)
												? `${
														activeBooking.resource
															.number
												  } • ${
														{
															en:
																activeBooking
																	.resource
																	.title_en,
															hk:
																activeBooking
																	.resource
																	.title_hk,
															cn:
																activeBooking
																	.resource
																	.title_cn,
														}[i18n.language]
												  }`
												: activeBooking.resource.number
										}
										onPress={() => {
											navigation.navigate(
												routes.navigators.BOOKINGS,
												{
													screen:
														routes.screens
															.BOOKING_DETAILS,
													params: {
														item: activeBooking,
													},
												}
											);
										}}
										buttonTitle={
											activeBooking.checkin_time == null
												? moment().isAfter(
														moment(
															activeBooking.start_time
														).add(15, "m")
												  )
													? t("common:lateCheckIn", {
															value: moment().diff(
																moment(
																	activeBooking.start_time
																),
																"m"
															),
													  })
													: t("common:checkIn")
												: t(
														moment().isAfter(
															moment(
																activeBooking.start_time
															).add(15, "m")
														)
															? "common:late"
															: "common:checkedIn",
														{
															value: moment(
																activeBooking.checkin_time
															).format("HH:mm"),
														}
												  )
										}
										disabled={
											activeBooking.checkin_time == null
												? false
												: true
										}
										onCheckIn={() =>
											navigation.navigate(
												routes.navigators.BOOKINGS,
												{
													screen:
														routes.screens
															.BOOKING_DETAILS,
													params: {
														item: activeBooking,
														checkInClicked: true,
													},
												}
											)
										}
									/>
								</Animatable.View>
							</View>
						)}
						{upcoming.length !== 0 && (
							<View>
								<View style={presetStyles.row}>
									<Text style={presetStyles.listHeader}>
										{t("common:today")}
									</Text>
								</View>
								{upcoming.map((item, index) => (
									<Animatable.View
										animation="fadeInRight"
										delay={index * 100}
										key={item.id}
										style={{
											marginTop: sizing(3),
										}}
									>
										<ViewBookingListItem
											date={moment(
												item.start_time
											).format(
												{
													en: "LL",
													hk: "YYYY年MM月DD日",
													cn: "YYYY年MM月DD日",
												}[i18n.language]
											)}
											period={`${moment(
												item.start_time
											).format("H:mm")} - ${moment(
												item.end_time
											).format("H:mm")}`}
											location={
												Boolean(item.resource.title_en)
													? `${item.resource.number} • ${item.resource.title_en}`
													: item.resource.number
											}
											onPress={() =>
												navigation.navigate(
													routes.navigators.BOOKINGS,
													{
														screen:
															routes.screens
																.BOOKING_DETAILS,
														params: {
															item,
														},
													}
												)
											}
										/>
									</Animatable.View>
								))}
							</View>
						)}
					</View>
				)}
				{!isLoading && (
					<View style={styles.categories}>
						<Text
							style={[
								styles.categoriesTitle,
								presetStyles.listHeader,
							]}
						>
							{t("categories")}
						</Text>
						<FlatList
							contentContainerStyle={{
								paddingLeft: sizing(6),
							}}
							horizontal
							// alwaysBounceHorizontal={false}
							showsHorizontalScrollIndicator={false}
							data={categories}
							keyExtractor={(item) => `${item.id}`}
							ItemSeparatorComponent={() => (
								<View style={styles.horizontalSeparator} />
							)}
							renderItem={({ item, index }) => (
								<Animatable.View
									key={item.id}
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
									<CategoryItem
										displayCard={false}
										imageUrl={item.image_url}
										title={
											{
												en: item.title_en,
												hk: item.title_hk,
												cn: item.title_cn,
											}[i18n.language]
										}
										selected={
											item.id === selectedCategory
												? true
												: false
										}
										onPress={() => {
											setSelectedCategory(item.id);
										}}
									/>
								</Animatable.View>
							)}
						/>
					</View>
				)}
				<View style={styles.resourcesContainer}>
					<View style={styles.resourceHeaderRow}>
						<Text
							style={[
								styles.resourcesTitle,
								presetStyles.listHeader,
							]}
						>
							{t("resources", { value: resources.length })}
						</Text>
						<TouchableOpacity
							onPress={() => setCampusOpen(true)}
							style={[presetStyles.row, styles.campusButton]}
						>
							<MaterialCommunityIcons
								name="office-building"
								size={24}
								color={colors.textSecondary}
							/>
							<Text
								style={{
									fontSize: sizing(3),
									color: colors.textSecondary,
									fontWeight: "500",
								}}
							>
								{t("campuses")}
							</Text>
						</TouchableOpacity>
					</View>
					{resources.map((item, index) => {
						return (
							<Animatable.View
								key={item.id}
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
									item={item}
									key={item.id}
									onPress={() =>
										navigation.navigate(
											routes.screens.DETAILED_RESOURCES,
											{ item }
										)
									}
								/>
							</Animatable.View>
						);
					})}
				</View>
			</ScrollView>
			{!isLoading && (
				<Modal
					visible={isCampusOpen}
					animationType="slide"
					presentationStyle="pageSheet"
				>
					<SafeAreaView>
						<ScrollView
							showsVerticalScrollIndicator={false}
							style={{
								margin: sizing(4),
								marginBottom: 0,
							}}
						>
							<TouchableOpacity
								onPress={() => setCampusOpen(false)}
							>
								<MaterialCommunityIcons
									name="close"
									size={24}
									color={colors.textSecondary}
								/>
							</TouchableOpacity>
							<View style={presetStyles.marginHorizontal}>
								<Text style={styles.branchTitle}>
									{t("campuses")}
								</Text>
								{branches.map((branch, index) => (
									<Animatable.View
										key={branch.id}
										delay={index * 250}
										animation="fadeInUp"
									>
										<CampusItem
											item={branch}
											title={
												{
													en: branch.title_en,
													hk: branch.title_hk,
													cn: branch.title_cn,
												}[i18n.language]
											}
											imageUrl={branch.image_url}
											onPress={() => {
												setCampusOpen(false);
												navigation.navigate(
													routes.screens
														.CAMPUS_RESOURCES,
													{ branch }
												);
											}}
										/>
									</Animatable.View>
								))}
							</View>
						</ScrollView>
					</SafeAreaView>
				</Modal>
			)}
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {},
	drawerToggle: {
		marginRight: sizing(3),
	},
	username: {
		fontSize: 20,
		fontWeight: "600",
	},
	searchIcon: {
		margin: 2,
		marginRight: 8,
	},
	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.backgroundPrimary,
		borderRadius: 8,
		padding: 12,
		marginVertical: 8,
		marginHorizontal: 24,
	},
	categories: {
		marginTop: 8,
	},
	categoriesTitle: {
		marginBottom: 10,
		marginLeft: 24,
	},
	loadingAnimation: {
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
	},
	horizontalSeparator: {
		width: sizing(0.5),
	},
	resourceHeaderRow: {
		marginHorizontal: sizing(6),
		flexDirection: "row",
	},
	resourcesContainer: {
		marginTop: sizing(4),
	},
	resourcesTitle: {
		flex: 1,
	},
	image: {
		height: 150,
		borderRadius: 15,
		resizeMode: "cover",
	},
	infoContainer: {
		marginVertical: 10,
		marginHorizontal: 12,
	},
	number: {
		fontSize: 18,
		fontWeight: "600",
	},
	title: {
		fontSize: 16,
		fontWeight: "500",
	},
	icon: {
		marginRight: 5,
	},
	capacity: {
		flexDirection: "row",
		alignItems: "center",
	},
	branchTitle: {
		fontSize: sizing(8),
		fontWeight: "600",
		marginTop: sizing(4),
		marginBottom: sizing(8),
	},
});

export default MainScreen;
