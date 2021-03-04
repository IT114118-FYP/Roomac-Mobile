import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	FlatList,
	Image,
	Switch,
	Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";

import * as BioStorage from "../biometrics/storage";
import Screen from "../components/Screen";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import useAuth from "../auth/useAuth";
import routes from "../navigations/routes";
import SettingsItem, { ChevronRight } from "../components/SettingsItem";

const AVATAR = 75;

function SettingsScreen({ navigation }) {
	const { user, logOut } = useAuth();
	const [isBioAvailable, setBioAvailable] = useState(false);
	const [isBioEnabled, setBioEnabled] = useState(false);
	const [isLoading, setLoading] = useState(false);

	const handleBioToggle = async () => {
		BioStorage.storeEnable(!isBioEnabled);
		setBioEnabled((previousState) => !previousState);

		const biometricsEnabled = await BioStorage.getEnable();
		console.log(biometricsEnabled);
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

	// useEffect(() => {
	//     if (isBioEnabled) {
	//         BioStorage.storeEnable(true);
	// 	} else {
	// 		BioStorage.storeEnable(false);
	// 	}
	// }, [isBioEnabled]);

	useEffect(() => {
		getBioAvailability();
	}, []);

	const UserIcon = () => (
		<View>
			{Boolean(user.image_url) ? (
				<Image
					source={{ url: user.image_url }}
					style={{
						borderRadius: AVATAR,
						height: AVATAR,
						width: AVATAR,
					}}
				/>
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
				</View>
			)}
		</View>
	);

	const LanguageChevron = () => (
		<View style={presetStyles.row}>
			<Text
				style={{
					color: colors.textSecondary,
					fontSize: sizing(4),
					marginRight: sizing(2),
				}}
			>
				English
			</Text>
			<ChevronRight />
		</View>
	);

	const data = [
		{
			id: 0,
			title: `${user.first_name}, ${user.last_name}`,
			description: user.email,
			LeftComponent: UserIcon,
			RightComponent: ChevronRight,
			onPress: () => navigation.navigate(routes.screens.PROFILE_SETTINGS),
		},
		{
			id: 1,
			title: "Change Language",
			RightComponent: LanguageChevron,
		},
		{
			id: 2,
			title: "Terms & Condition",
			RightComponent: ChevronRight,
			onPress: () =>
				navigation.navigate(routes.screens.TERMS_AND_CONDITION),
		},
		isBioAvailable && {
			id: 3,
			title: "Sign in with Touch ID / Face ID",
			RightComponent: () => (
				<Switch value={isBioEnabled} onValueChange={handleBioToggle} />
			),
			disabled: true,
		},
		{
			id: 4,
			title: "Log out",
			titleStyle: {
				color: "red",
				fontWeight: "500",
			},
			onPress: () => {
				Alert.alert("Log out", "Are you sure you want to log out?", [
					{
						text: "Cancel",
						style: "cancel",
					},
					{ text: "Log out", onPress: () => logOut() },
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
			<Text style={styles.title}>Settings</Text>
			{!isLoading && (
				<FlatList
					contentContainerStyle={styles.container}
					data={data}
					keyExtractor={(item) => `${item.id}`}
					ItemSeparatorComponent={() => (
						<View
							style={{
								height: 1,
								backgroundColor: "#d0d0d0",
							}}
						/>
					)}
					renderItem={({ item }) => (
						<SettingsItem key={item.id} {...item} />
					)}
				/>
			)}
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: sizing(6),
		// backgroundColor: colors.backgroundPrimary,
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
