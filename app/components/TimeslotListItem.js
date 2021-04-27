import React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import moment from "moment";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import presetStyles, { sizing } from "../themes/presetStyles";
import colors from "../themes/colors";

export default function TimeslotListItem({
	start,
	end,
	location,
	onPress,
	deletable,
}) {
	const colorScheme = useColorScheme();

	return (
		<Swipeable
			enabled={deletable}
			renderRightActions={() => (
				<View
					style={{
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<TouchableOpacity
						onPress={onPress}
						style={{
							// padding: sizing(2),
							marginLeft: sizing(2),
							borderRadius: sizing(12),
							// backgroundColor: colors(colorScheme).Light_Orange + "33",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<MaterialCommunityIcons
							name="minus"
							size={sizing(7.5)}
							color={colors(colorScheme).danger}
						/>
					</TouchableOpacity>
				</View>
			)}
		>
			<TouchableOpacity
				onPress={onPress}
				style={[
					presetStyles.shadow,
					presetStyles.row,
					{
						padding: sizing(3),
						backgroundColor:
							colorScheme === "light"
								? colors(colorScheme).backgroundPrimary
								: colors(colorScheme).backgroundSecondary,
						borderRadius: sizing(2),
						marginTop: sizing(2),
					},
				]}
			>
				<View
					style={{
						height: sizing(2),
						width: sizing(2),
						borderRadius: sizing(2),
						backgroundColor: moment(start, "HH:mm:ss").isBefore(
							moment("12:00", "H:mm"),
							"hour"
						)
							? colors().secondary
							: colors().Light_Orange,
						marginRight: sizing(2),
					}}
				/>
				<Text
					style={{ flex: 1, color: colors(colorScheme).textPrimary }}
				>
					{moment(start, "HH:mm:ss").format("H:mm")} -{" "}
					{moment(end, "HH:mm:ss").format("H:mm")}
				</Text>
				<Text
					style={{
						color: colors(colorScheme).textSecondary,
					}}
				>
					{location}
				</Text>
			</TouchableOpacity>
		</Swipeable>
	);
}
