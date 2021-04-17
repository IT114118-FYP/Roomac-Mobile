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

const { width, height } = Dimensions.get("screen");

function CampusLocationsScreen({ navigation }) {
	const { t, i18n } = useTranslation([routes.screens.CAMPUS_LOCATIONS]);
	const [isLoading, setLoading] = useState();
	const [branches, setBranches] = useState([]);
	const [selected, setSelected] = useState(1);

	const bottomSheetRef = useRef(null);

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
		axiosInstance
			.get("/api/branches")
			.then(({ data }) => {
				setBranches(data);
				console.log(data);
				setLoading(false);
			})
			.catch((error) => console.log(error));
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
							color={colors.textPrimary}
							size={sizing(5.5)}
						/>
					</TouchableOpacity>
					<BottomSheet
						ref={bottomSheetRef}
						index={1}
						snapPoints={snapPoints}
						onChange={handleSheetChanges}
					>
						<View
							style={{
								// flexDirection: "row",
								margin: sizing(2),
							}}
						>
							<View style={presetStyles.row}>
								<Text
									style={{
										fontSize: sizing(6),
										fontWeight: "500",
										marginLeft: sizing(5),
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
										url: branches[selected]?.image_url,
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
		backgroundColor: colors.backgroundPrimary,
	},
	contentContainer: {
		flex: 1,
		alignItems: "center",
	},
	list: {
		position: "absolute",
		bottom: sizing(10),
	},
});

export default CampusLocationsScreen;
