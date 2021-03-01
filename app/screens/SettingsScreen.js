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
import SettingsItem from "../components/SettingsItem";

const AVATAR = 150;

const data = [
	{
		id: 0,
		title: "Change Language",
		iconColor: "gray",
		iconName: "language",
		enter: true,
	},
	{
		id: 1,
		title: "Terms & Condition",
		iconColor: "#f5b300",
		iconName: "library-books",
		enter: true,
	},
	{
		id: 2,
		title: "Log out",
		iconColor: "red",
		iconName: "logout",
		provider: "MaterialCommunityIcons",
		// enter: true,
	},
];

function SettingsScreen({ navigation }) {
	const { user } = useAuth();
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
			<ScrollView>
				<View
					style={{
						alignItems: "center",
						justifyContent: "center",
						marginBottom: sizing(6),
					}}
				>
					{Boolean(user.image_url) ? (
						<ImageBackground
							source={{ url: user.image_url }}
							imageStyle={{
								borderRadius: AVATAR,
							}}
							style={{
								marginBottom: sizing(4),
								height: AVATAR,
								width: AVATAR,
								// justifyContent: "center",
								// alignItems: "center",
								// overflow: "hidden",
							}}
						>
							<TouchableOpacity
								style={{
									position: "absolute",
									bottom: 0,
									right: 0,
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: "#000000aa",
									padding: sizing(3),
									borderRadius: sizing(10),
								}}
							>
								<MaterialIcons
									name="edit"
									color={colors.backgroundPrimary}
									size={sizing(4)}
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
						{`${user.first_name}, ${user.last_name}`}
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
				</View>
				<FlatList
					scrollEnabled={false}
					contentContainerStyle={styles.container}
					data={data}
					keyExtractor={(item) => `${item.id}`}
					ItemSeparatorComponent={() => (
						<View
							style={{
								height: 1,
								backgroundColor: "#d0d0d0",
								marginVertical: sizing(3),
								// marginHorizontal: sizing(2),
							}}
						/>
					)}
					renderItem={({ item }) => (
						<SettingsItem
							key={item.id}
							title={item.title}
							iconColor={item.iconColor}
							iconName={item.iconName}
							enter={item.enter}
							provider={item.provider}
						/>
					)}
				/>
			</ScrollView>
		</Screen>
	);
}

const styles = StyleSheet.create({
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
