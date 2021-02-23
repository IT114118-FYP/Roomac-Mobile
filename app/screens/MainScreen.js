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
import LottieView from "lottie-react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

import { axiosInstance } from "../api/config";
import CategoryItem from "../components/CategoryItem";
import Screen from "../components/Screen";
import ResourceItem from "../components/ResourceItem";
import useAuth from "../auth/useAuth";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";

function MainScreen({ navigation }) {
	const { user } = useAuth();
	const [isLoading, setLoading] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(1);
	const [categories, setCategories] = useState([]);
	const [resources, setResources] = useState([]);
	const [isfilterOpen, setFilterOpen] = useState(false);

	useEffect(() => {
		fetchCategories();
	}, []);

	useEffect(() => {
		fetchResources();
	}, [selectedCategory]);

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
			<ScrollView
				contentContainerStyle={{
					paddingTop: 24,
				}}
				refreshControl={
					<RefreshControl
						refreshing={isLoading}
						onRefresh={fetchResources}
						title="pull to refresh"
					/>
				}
			>
				<Text style={styles.username}>Welcome, {user.first_name}</Text>
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
	username: {
		fontSize: 20,
		fontWeight: "600",
		marginBottom: 10,
		marginLeft: 24,
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
