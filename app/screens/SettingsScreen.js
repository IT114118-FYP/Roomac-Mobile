import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
	FlatList,
	Image,
	VirtualizedList,
	ImageBackground,
} from "react-native";
import moment from "moment";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

import { axiosInstance } from "../api/config";
import Screen from "../components/Screen";
import ViewBookingListItem from "../components/ViewBookingListItem";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import useAuth from "../auth/useAuth";
import routes from "../navigations/routes";
import SettingsItem, { ChevronRight } from "../components/SettingsItem";

const AVATAR = 75;

function SettingsScreen({ navigation }) {
	const { user } = useAuth();

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
							fontSize: sizing(10),
							fontWeight: "600",
						}}
					>
						{`${user.first_name[0]}${user.last_name[0]}`}
					</Text>
				</View>
			)}
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
			RightComponent: ChevronRight,
		},
		{
			id: 2,
			title: "Terms & Condition",
			RightComponent: ChevronRight,
		},
		{
			id: 3,
			title: "Log out",
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
