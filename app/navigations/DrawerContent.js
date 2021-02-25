import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	SafeAreaView,
} from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import routes from "./routes";
import { sizing } from "../themes/presetStyles";
import useAuth from "../auth/useAuth";

function DrawerContent(props) {
	const { logOut } = useAuth();

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View
				style={{
					alignItems: "center",
					justifyContent: "center",
					marginTop: sizing(6),
				}}
			>
				<Text
					style={{
						fontSize: 36,
						fontWeight: "bold",
						color: "#333333",
					}}
				>
					roomac
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
					label={routes.HOME}
					onPress={() => {
						props.navigation.navigate(routes.HOME);
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
					label="My Bookings"
					onPress={() => {
						props.navigation.navigate(routes.VIEW_BOOKINGS);
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
				label="Logout"
				onPress={() => logOut()}
			/>
		</SafeAreaView>
	);
}

export default DrawerContent;
