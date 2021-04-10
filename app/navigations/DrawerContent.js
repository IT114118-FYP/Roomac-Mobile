import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	SafeAreaView,
	Alert,
	Image,
} from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import routes from "./routes";
import { sizing } from "../themes/presetStyles";
import useAuth from "../auth/useAuth";
import colors from "../themes/colors";

import { useTranslation } from "react-i18next";

function DrawerContent(props) {
	const { user, logOut } = useAuth();
	const { t, i18n } = useTranslation([
		"Drawer",
		"common",
		routes.screens.SETTINGS,
	]);
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View
				style={{
					alignItems: "center",
					justifyContent: "center",
					marginTop: sizing(6),
				}}
			>
				{Boolean(user.image_url) ? (
					<Image
						source={{ url: user.image_url }}
						style={{
							height: 135,
							width: 135,
							marginVertical: sizing(4),
							borderRadius: 150,
							justifyContent: "center",
							alignItems: "center",
						}}
					/>
				) : (
					<View
						style={{
							backgroundColor: colors.Powder_Blue,
							height: 135,
							width: 135,
							marginVertical: sizing(4),
							borderRadius: 150,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text
							style={{
								color: colors.backgroundSecondary,
								fontSize: sizing(10),
								fontWeight: "600",
							}}
						>
							{`${user.first_name[0]}${user.last_name[0]}`}
						</Text>
					</View>
				)}
				<Text
					style={{
						fontSize: sizing(6),
						fontWeight: "500",
						color: colors.textPrimary,
					}}
				>
					{
						{
							en: `${user.first_name}, ${user.last_name}`,
							hk: user.chinese_name,
							cn: user.chinese_name,
						}[i18n.language]
					}
				</Text>
				<Text
					style={{
						fontSize: sizing(3),
						color: colors.textSecondary,
						marginTop: sizing(2),
					}}
					numberOfLines={1}
				>
					{user.email}
				</Text>
				<View
					style={{
						marginTop: 25,
						backgroundColor: "grey",
						height: 1,
						width: "70%",
					}}
				></View>
			</View>
			<DrawerContentScrollView style={{ flex: 1 }}>
				<DrawerItem
					icon={({ color, size }) => (
						<MaterialCommunityIcons
							name="home"
							color={color}
							size={size}
						/>
					)}
					label={t("home")}
					onPress={() => {
						props.navigation.navigate(routes.navigators.HOME);
					}}
				/>
				<DrawerItem
					icon={({ color, size }) => (
						<MaterialCommunityIcons
							name="clipboard-text"
							color={color}
							size={size}
						/>
					)}
					label={t("bookings")}
					onPress={() => {
						props.navigation.navigate(routes.navigators.BOOKINGS);
					}}
				/>
				<DrawerItem
					icon={({ color, size }) => (
						<MaterialCommunityIcons
							name="map"
							color={color}
							size={size}
						/>
					)}
					label={t("campuses")}
					onPress={() => {
						props.navigation.navigate(routes.navigators.CAMPUS);
					}}
				/>
				<DrawerItem
					icon={({ color, size }) => (
						<Ionicons
							name="ios-settings"
							color={color}
							size={size}
						/>
					)}
					label={t("settings")}
					onPress={() => {
						props.navigation.navigate(routes.navigators.SETTINGS);
					}}
				/>
			</DrawerContentScrollView>
			<View
				style={{
					alignItems: "center",
					justifyContent: "center",
					marginBottom: sizing(4),
				}}
			>
				<View
					style={{
						backgroundColor: "grey",
						height: 1,
						width: "70%",
					}}
				></View>
			</View>
			<DrawerItem
				style={{
					marginBottom: sizing(10),
				}}
				icon={({ color, size }) => (
					<MaterialCommunityIcons
						name="logout"
						color={color}
						size={size}
					/>
				)}
				label={t("common:logout")}
				onPress={() => {
					Alert.alert(
						t("common:logout"),
						t(routes.screens.SETTINGS + ":logoutConfirm"),
						[
							{
								text: t(routes.screens.SETTINGS + ":cancel"),
								style: "cancel",
							},
							{
								text: t("common:logout"),
								onPress: () => logOut(),
							},
						]
					);
				}}
			/>
		</SafeAreaView>
	);
}

export default DrawerContent;
