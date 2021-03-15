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

import { TimeSection } from "./ViewBookingsScreen";
import { axiosInstance } from "../api/config";
import CategoryItem from "../components/CategoryItem";
import Screen from "../components/Screen";
import ResourceItem from "../components/ResourceItem";
import ViewBookingListItem from "../components/ViewBookingListItem";
import useAuth from "../auth/useAuth";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import { DrawerActions } from "@react-navigation/routers";
import routes from "../navigations/routes";

function MainScreen({ navigation }) {
	const { user } = useAuth();
	const [isLoading, setLoading] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(1);
	const [activeBooking, setActiveBooking] = useState(null);
	const [upcoming, setUpcoming] = useState([]);
	const [categories, setCategories] = useState([]);
	const [resources, setResources] = useState([]);
	const [isfilterOpen, setFilterOpen] = useState(false);

	useEffect(() => {
		fetchCategories();
		fetchBookings();
	}, []);

	useEffect(() => {
		fetchResources();
	}, [selectedCategory]);

	const fetchAll = () => {
		fetchCategories();
		fetchBookings();
		fetchResources();
	};

	const fetchBookings = () => {
		axiosInstance(
			`/api/users/${user.id}/bookings?start=${moment().format(
				"YYYY-MM-DD"
			)}&end=${moment().format("YYYY-MM-DD")}`
		).then(({ data }) => {
			console.log(data);

			const current = moment();
			var upcomingData = [];
			data.forEach((booking) => {
				if (moment().isBetween(booking.start_time, booking.end_time)) {
					setActiveBooking(booking);
				} else if (moment(booking.start_time).isAfter(current)) {
					upcomingData.push(booking);
				}
			});
			upcomingData.sort((a, b) =>
				moment(a.start_time).isAfter(moment(b.start_time))
			);
			setUpcoming(upcomingData);
		});
	};

	const fetchCategories = () => {
		setLoading(true);
		axiosInstance
			.get("/api/categories")
			.then(({ data }) => {
				setCategories(data);
				setSelectedCategory(data[0].id);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
	};

	const fetchResources = () => {
		// setLoading(true);
		axiosInstance
			.get(`/api/categories/${selectedCategory}`)
			.then(({ data }) => {
				setResources(data);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
	};

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
				<Text style={styles.username}>Welcome, {user.first_name}</Text>
			</View>
			<View style={[styles.searchBar, presetStyles.shadow]}>
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
					help me find a resource
				</Text>
			</View>
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={isLoading}
						onRefresh={fetchAll}
						title="pull to refresh"
					/>
				}
			>
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
								Now
							</Text>

							<Animatable.View animation="fadeInRight">
								<ViewBookingListItem
									active
									// onCheckIn
									date={moment(
										activeBooking.start_time
									).format("LL")}
									period={`${moment(
										activeBooking.start_time
									).format("H:mm")} - ${moment(
										activeBooking.end_time
									).format("H:mm")}`}
									location={
										Boolean(activeBooking.resource.title_en)
											? `${activeBooking.resource.number} • ${activeBooking.resource.title_en}`
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
								/>
							</Animatable.View>
						</View>
					)}
					{upcoming.length !== 0 && (
						<View>
							<View style={presetStyles.row}>
								<Text style={presetStyles.listHeader}>
									Today
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
										date={moment(item.start_time).format(
											"LL"
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
				{!isLoading && (
					<View style={styles.categories}>
						<Text
							style={[
								styles.categoriesTitle,
								presetStyles.listHeader,
							]}
						>
							Categories
						</Text>
						<FlatList
							contentContainerStyle={{
								paddingLeft: sizing(6),
							}}
							horizontal
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
										title={item.title_en}
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
							Resources ({resources.length})
						</Text>
						<TouchableOpacity onPress={() => setFilterOpen(true)}>
							<MaterialCommunityIcons
								name="filter-variant"
								size={24}
								color={colors.textSecondary}
							/>
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
											"DetailedResources",
											{ item }
										)
									}
								/>
							</Animatable.View>
						);
					})}
				</View>
			</ScrollView>
			<Modal
				visible={isfilterOpen}
				animationType="slide"
				presentationStyle="pageSheet"
			>
				<SafeAreaView>
					<TouchableOpacity onPress={() => setFilterOpen(false)}>
						<MaterialCommunityIcons
							name="close"
							size={24}
							color={colors.textSecondary}
						/>
					</TouchableOpacity>
				</SafeAreaView>
			</Modal>
			{/* <Modal
				visible={isLoading}
				animationType="fade"
				style={styles.loadingAnimation}
			>
				<LottieView
					source={require("../../assets/preloader.json")}
					autoPlay
				/>
			</Modal> */}
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
});

export default MainScreen;
