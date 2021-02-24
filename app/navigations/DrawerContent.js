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

function DrawerContent(props) {
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
			<DrawerContentScrollView>
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
							name="plus"
							color={color}
							size={size}
						/>
					)}
					label={routes.VIEW_BOOKINGS}
					onPress={() => {
						props.navigation.navigate(routes.VIEW_BOOKINGS);
					}}
				/>
			</DrawerContentScrollView>
		</SafeAreaView>
	);
}

export default DrawerContent;
