import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	View,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
	Image,
	Button,
	useColorScheme,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";

import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import { axiosInstance } from "../api/config";
import BottomSheet from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import routes from "../navigations/routes";
import branchesApi from "../api/branches";

const { width, height } = Dimensions.get("screen");

function CampusLocationsScreen({ navigation }) {
	const { t, i18n } = useTranslation([routes.screens.CAMPUS_LOCATIONS]);
	const colorScheme = useColorScheme();
	const [isLoading, setLoading] = useState(true);
	const [branches, setBranches] = useState([]);
	const [selected, setSelected] = useState(1);

	const bottomSheetRef = useRef(null);

	const styles = StyleSheet.create({
		container: {
			flex: 1,
		},
		map: {
			height,
			width,
		},
		drawerToggle: {
			position: "absolute",
			top: Constants.statusBarHeight,
			margin: sizing(3),
			padding: sizing(3),
			borderRadius: sizing(6),
			backgroundColor: colors(colorScheme).backgroundPrimary,
		},
		contentContainer: {
			flex: 1,
			alignItems: "center",
		},
		list: {
			position: "absolute",
			bottom: sizing(10),
		},
		sheetContainer: {
			// flexDirection: "row",
			padding: sizing(2),
		},
	});

	// variables
	const snapPoints = useMemo(() => ["7%", "40%"], []);

	// callbacks
	const handleSheetChanges = useCallback((index) => {
		console.log("handleSheetChanges", index);
	}, []);

	const handleSelectedMarker = (event) => {
		setSelected(event._targetInst.return.key);
		bottomSheetRef.current.snapTo(1);
	};

	const fetchCampuses = () => {
		setLoading(true);
		branchesApi
			.fetchAll()
			.then(({ data }) => {
				setBranches(data);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchCampuses();
	}, []);

	return (
		<View style={styles.container}>
			{!isLoading && (
				<View style={styles.container}>
					<MapView
						style={[StyleSheet.absoluteFill, styles.map]}
						showsUserLocation
						initialRegion={{
							latitude: 22.15,
							longitude: 114.1,
							latitudeDelta: 0.75,
							longitudeDelta: 0.3,
						}}
					>
						{branches.map((branch, index) => (
							<Marker
								onPress={handleSelectedMarker}
								key={index}
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
						))}
					</MapView>
					<TouchableOpacity
						style={styles.drawerToggle}
						onPress={navigation.toggleDrawer}
					>
						<Feather
							name="menu"
							color={colors(colorScheme).textPrimary}
							size={sizing(5.5)}
						/>
					</TouchableOpacity>
					<BottomSheet
						ref={bottomSheetRef}
						index={1}
						snapPoints={snapPoints}
						onChange={handleSheetChanges}
					>
						<View style={styles.sheetContainer}>
							<View
								style={[
									presetStyles.row,
									presetStyles.marginHorizontal,
								]}
							>
								<Text
									style={{
										fontSize: sizing(6),
										fontWeight: "500",
										flex: 1,
									}}
								>
									{
										{
											en: branches[selected]?.title_en,
											hk: branches[selected]?.title_hk,
											cn: branches[selected]?.title_cn,
										}[i18n.language]
									}
								</Text>
								<Button
									title={t("campusResources")}
									onPress={() =>
										navigation.navigate(
											routes.navigators.HOME,
											{
												screen:
													routes.screens
														.CAMPUS_RESOURCES,
												params: {
													branch: branches[selected],
												},
											}
										)
									}
								/>
							</View>
							<View
								style={{
									alignItems: "center",
									marginVertical: sizing(6),
								}}
							>
								<Image
									style={{
										width: "90%",
										height: 180,
										borderRadius: sizing(2),
									}}
									resizeMode="cover"
									source={{
										uri: branches[selected]?.image_url,
									}}
								/>
							</View>
						</View>
					</BottomSheet>
				</View>
			)}
		</View>
	);
}

export default CampusLocationsScreen;
