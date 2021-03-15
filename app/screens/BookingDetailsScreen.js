import moment from "moment";
import React from "react";
import {
	View,
	StyleSheet,
	Text,
	Image,
	Dimensions,
	ScrollView,
	StatusBar,
} from "react-native";

import {
	MaterialIcons,
	MaterialCommunityIcons,
	FontAwesome5,
} from "@expo/vector-icons";

import Screen from "../components/Screen";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import { axiosInstance } from "../api/config";
import { useState } from "react";
import { useEffect } from "react";
import Markdown from "react-native-markdown-display";
import Button from "../components/Button";

const { width, height } = Dimensions.get("screen");

function BookingDetailsScreen({ route }) {
	const { item } = route.params;
	const [tos, setTos] = useState();

	const fetchTOS = () => {
		axiosInstance
			.get(`/api/tos/${item.resource.tos_id}`)
			.then(({ data }) => {
				setTos(data);
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		console.log(moment().toString());
		console.log(moment(item.start_time).toString());
		const subtarctedTime = moment(item.start_time).subtract(15, "minutes");
		console.log(moment().isBetween(subtarctedTime, moment()));
		fetchTOS();
	}, []);

	return (
		<ScrollView style={styles.container}>
			<StatusBar barStyle="light-content" animated={true} />
			<Image
				source={{ uri: item.resource.image_url }}
				style={styles.image}
			/>
			<Text style={[presetStyles.marginHorizontal, styles.date]}>
				{moment(item.start_time).format("LL")}
			</Text>
			<Text
				adjustsFontSizeToFit
				numberOfLines={1}
				style={[presetStyles.marginHorizontal, styles.title]}
			>
				{`${moment(item.start_time).format("H:mm")} - ${moment(
					item.end_time
				).format("H:mm")} • ${item.resource.number}`}
			</Text>
			<View style={presetStyles.marginHorizontal}>
				<View style={[presetStyles.row, { marginTop: sizing(2) }]}>
					<MaterialCommunityIcons
						name="account-multiple"
						size={sizing(4)}
						color={colors.textSecondary}
						style={styles.icon}
					/>
					<Text
						style={{
							color: colors.textSecondary,
							marginLeft: sizing(2),
						}}
					>{`${item.resource.min_user} - ${item.resource.max_user}`}</Text>
				</View>
			</View>
			{moment(item.end_time).isAfter(moment()) && (
				<View
					style={[
						presetStyles.marginHorizontal,
						presetStyles.row,
						{
							marginVertical: sizing(4),
						},
					]}
				>
					<Button
						style={{
							marginRight: sizing(3),
							backgroundColor: colors.Light_Orange,
						}}
					>
						<MaterialIcons
							name="edit"
							size={sizing(6)}
							color={colors.backgroundPrimary}
						/>
					</Button>
					{moment().isBetween(
						moment(item.start_time).subtract(15, "minutes"),
						moment(item.end_time)
					) ? (
						<Button title="Check In" style={{ flex: 1 }} />
					) : (
						<Button
							title={`Check in available after ${moment(
								item.start_time
							)
								.subtract(15, "minutes")
								.format("H:mm")}`}
							style={{
								flex: 1,
								backgroundColor: colors.textSecondary,
							}}
							disabled
						/>
					)}
				</View>
			)}
			{tos && (
				<View
					style={[
						presetStyles.marginHorizontal,
						{
							marginTop: sizing(4),
						},
					]}
				>
					<Text
						style={[
							presetStyles.listHeader,
							{
								marginBottom: sizing(4),
							},
						]}
					>
						Terms and Conditions
					</Text>
					<Markdown
						style={{
							text: {
								fontSize: sizing(4),
								color: colors.textSecondary,
							},
							list_item: {
								flexDirection: "row",
								justifyContent: "flex-start",
								marginBottom: sizing(4),
							},
						}}
					>
						{tos.tos_en}
					</Markdown>
				</View>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {},
	image: {
		width,
		height: height * 0.3,
	},
	date: {
		fontSize: sizing(4),
		paddingTop: sizing(6),
		fontWeight: "400",
		color: colors.textSecondary,
	},
	title: {
		fontSize: sizing(7),
		paddingTop: sizing(2),
		fontWeight: "600",
	},
});

export default BookingDetailsScreen;
