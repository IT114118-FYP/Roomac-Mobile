import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	ImageBackground,
	TouchableOpacity,
	Text,
	Dimensions,
	Platform,
	Image,
	ScrollView,
	RefreshControl,
} from "react-native";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import useAuth from "../auth/useAuth";
import Screen from "../components/Screen";
import { sizing } from "../themes/presetStyles";
import colors from "../themes/colors";
import { axiosInstance } from "../api/config";

const { width } = Dimensions.get("screen");

const AVATAR = width * 0.4;

export default function ProfileSettingsScreen(props) {
	const { user, fetchUser } = useAuth();

	useEffect(() => {
		getImagePermission();
	}, []);

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
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.cancelled) {
			updateUser(result.uri);
		}
	};

	const updateUser = (image_url) => {
		axiosInstance
			.put(`/api/users/${user.id}`, {
				...user,
				image_url,
			})
			.then(() => fetchUser())
			.catch((error) => console.log(error));
	};

	const EditButton = () => (
		<TouchableOpacity
			onPress={pickImage}
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
	);

	return (
		<Screen style={styles.container}>
			<Text style={styles.title}>Profile</Text>
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
							}}
						>
							<EditButton />
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
							<EditButton />
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
			</ScrollView>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {},
	title: {
		fontSize: sizing(8),
		fontWeight: "600",
		color: colors.Oxford_Blue,
		marginTop: sizing(14),
		marginBottom: sizing(6),
		paddingHorizontal: sizing(6),
	},
});
