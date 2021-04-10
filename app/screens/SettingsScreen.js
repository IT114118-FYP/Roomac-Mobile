import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Switch,
	Alert,
	ScrollView,
	ImageBackground,
} from "react-native";
import {
	Feather,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import * as ImagePicker from "expo-image-picker";

import * as BioStorage from "../biometrics/storage";
import Screen from "../components/Screen";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import useAuth from "../auth/useAuth";
import routes from "../navigations/routes";
import SettingsItem, { ChevronRight } from "../components/SettingsItem";
import { axiosInstance } from "../api/config";
import { useTranslation } from "react-i18next";

const AVATAR = 90;

function SettingsScreen({ navigation }) {
	const { t, i18n } = useTranslation([routes.screens.SETTINGS]);
	const { user, logOut, fetchUser } = useAuth();
	const [isBioAvailable, setBioAvailable] = useState(false);
	const [isBioEnabled, setBioEnabled] = useState(false);
	const [isLoading, setLoading] = useState(false);

	const handleBioToggle = async () => {
		BioStorage.storeEnable(!isBioEnabled);
		setBioEnabled((previousState) => !previousState);
	};

	const getBioAvailability = async () => {
		setLoading(true);
		const biometricsEnabled = await BioStorage.getEnable();
		setBioEnabled(biometricsEnabled);
		LocalAuthentication.hasHardwareAsync()
			.then((response) => {
				setBioAvailable(response);
			})
			.catch((error) => {
				console.log(error);
				setBioAvailable(false);
			})
			.finally(() => setLoading(false));
	};

	const getImagePermission = async () => {
		if (Platform.OS !== "web") {
			const {
				status,
			} = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== "granted") {
				alert(
					"Sorry, we need camera roll permissions to make this work!"
				);
			}
		}
	};

	const pickImage = async () => {
		getImagePermission().then(async () => {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});

			console.log(result);

			if (!result.cancelled) {
				updateImage(result);
			}
		});
	};

	const updateImage = (result) => {
		/*
		const data = new FormData();
		data.append(`image`, {
			name: "image/jpeg",
			type: "image/jpeg", // <-
			uri: result.uri,
		});
		*/

		// ImagePicker saves the taken photo to disk and returns a local URI to it
		let localUri = result.uri;
		let filename = localUri.split("/").pop();

		// Infer the type of the image
		let match = /\.(\w+)$/.exec(filename);
		let type = match ? `image/${match[1]}` : `image`;

		// Upload the image using the fetch and FormData APIs
		let formData = new FormData();
		formData.append("image", { uri: localUri, name: filename, type: type });

		axiosInstance
			.post(`/api/users/me/avatar`, formData, {
				headers: {
					"content-type": "multipart/form-data",
				},
			})
			.then(() => fetchUser())
			.catch((error) => console.log(error.response.data));
	};

	useEffect(() => {
		getBioAvailability();
		// getImagePermission();
	}, []);

	const UserIcon = () => (
		<View>
			{Boolean(user.image_url) ? (
				<ImageBackground
					source={{ url: user.image_url }}
					imageStyle={{
						borderRadius: AVATAR,
					}}
					style={{
						height: AVATAR,
						width: AVATAR,
					}}
				>
					<TouchableOpacity
						onPress={pickImage}
						style={styles.editImageIcon}
					>
						<MaterialIcons
							name="edit"
							color={colors.backgroundPrimary}
							size={sizing(4.5)}
						/>
					</TouchableOpacity>
				</ImageBackground>
			) : (
				<View
					style={{
						backgroundColor: colors.Powder_Blue,
						height: AVATAR,
						width: AVATAR,
						marginBottom: sizing(4),
						borderRadius: AVATAR,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Text
						style={{
							color: colors.backgroundSecondary,
							fontSize: sizing(6),
							fontWeight: "600",
						}}
					>
						{`${user.first_name[0]}${user.last_name[0]}`}
					</Text>
					<TouchableOpacity
						onPress={pickImage}
						style={styles.editImageIcon}
					>
						<MaterialIcons
							name="edit"
							color={colors.backgroundPrimary}
							size={sizing(4.5)}
						/>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);

	const LanguageChevron = () => {
		const { t, i18n } = useTranslation();

		return (
			<View style={presetStyles.row}>
				<Text
					style={{
						color: colors.textSecondary,
						fontSize: sizing(4),
						marginRight: sizing(2),
					}}
				>
					{
						{
							en: "English",
							cn: "简体中文",
							hk: "繁體中文",
						}[i18n.language]
					}
				</Text>
				<ChevronRight />
			</View>
		);
	};

	const data = [
		{
			id: 0,
			title: t("language"),
			RightComponent: LanguageChevron,
			onPress: () => navigation.navigate(routes.screens.CHANGE_LANGUAGE),
		},
		{
			id: 1,
			title: t("password"),
			RightComponent: ChevronRight,
			onPress: () => navigation.navigate(routes.screens.CHANGE_PASSWORD),
		},
		isBioAvailable && {
			id: 2,
			title: t("bio"),
			RightComponent: () => (
				<Switch value={isBioEnabled} onValueChange={handleBioToggle} />
			),
			disabled: true,
		},
		{
			id: 3,
			title: t("logout"),
			titleStyle: {
				color: "red",
				fontWeight: "500",
			},
			onPress: () => {
				Alert.alert(t("logout"), t("logoutConfirm"), [
					{
						text: t("cancel"),
						style: "cancel",
					},
					{
						text: t("logout"),
						onPress: () => logOut(),
					},
				]);
			},
		},
	];

	return (
		<Screen>
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
			<ScrollView>
				<Text style={styles.title}>{t("settings")}</Text>
				<View style={styles.profileContainer}>
					<View style={[presetStyles.row]}>
						<UserIcon />
						<View style={styles.detailsContainer}>
							<Text style={styles.username}>
								{
									{
										en: `${user.first_name}, ${user.last_name}`,
										hk: user.chinese_name,
										cn: user.chinese_name,
									}[i18n.language]
								}
							</Text>
							<Text style={styles.CNA}>{user.name}</Text>
						</View>
					</View>
					<View style={styles.additionalDetailsContainer}>
						<View
							style={[presetStyles.row, styles.additionalDetails]}
						>
							<MaterialCommunityIcons
								name="email"
								size={sizing(4)}
								color={colors.textSecondary}
							/>
							<Text style={styles.additionalDetailsFont}>
								{user.email}
							</Text>
						</View>
						<View
							style={[presetStyles.row, styles.additionalDetails]}
						>
							<MaterialCommunityIcons
								name="book-open-page-variant"
								size={sizing(4)}
								color={colors.textSecondary}
							/>
							<Text style={styles.additionalDetailsFont}>
								{`${user.program_id} (${user.branch_id})`}
							</Text>
						</View>
					</View>
				</View>
				{!isLoading && (
					<View style={styles.container}>
						{data.map((item, index) => (
							<View key={`${item.id}`}>
								<SettingsItem {...item} />
								{index < data.length - 1 && (
									<View
										style={{
											height: 1,
											backgroundColor: "#d0d0d0",
										}}
									/>
								)}
							</View>
						))}
					</View>
				)}
			</ScrollView>
		</Screen>
	);
}

const styles = StyleSheet.create({
	profileContainer: {
		paddingHorizontal: sizing(6),
	},
	editImageIcon: {
		position: "absolute",
		bottom: sizing(-1.5),
		right: sizing(-1.5),
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#000000c0",
		padding: sizing(2),
		borderRadius: sizing(10),
		borderWidth: sizing(0.5),
		borderColor: colors.backgroundSecondary,
	},
	detailsContainer: {
		marginLeft: sizing(4),
	},
	username: {
		fontSize: sizing(7),
		color: colors.textPrimary,
		fontWeight: "600",
	},
	CNA: {
		marginTop: sizing(1),
		fontSize: sizing(4),
		color: colors.textSecondary,
	},
	additionalDetailsContainer: {
		marginTop: sizing(5),
	},
	additionalDetails: {
		marginBottom: sizing(3),
	},
	additionalDetailsFont: {
		marginLeft: sizing(3),
		fontSize: sizing(4),
		color: colors.textSecondary,
	},
	container: {
		paddingHorizontal: sizing(6),
	},
	drawerToggle: {
		marginTop: sizing(5),
		paddingHorizontal: sizing(6),
	},
	title: {
		fontSize: sizing(8),
		fontWeight: "600",
		color: colors.Oxford_Blue,
		marginVertical: sizing(6),
		paddingHorizontal: sizing(6),
	},
	header: {
		fontSize: sizing(3.5),
		color: colors.textSecondary,
		flex: 1,
	},
	section: {
		marginBottom: sizing(4),
	},
});

export default SettingsScreen;
