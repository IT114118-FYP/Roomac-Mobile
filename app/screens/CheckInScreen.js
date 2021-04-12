import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	Image,
	Dimensions,
	ScrollView,
	StatusBar,
	Modal,
	TouchableOpacity,
} from "react-native";

import {
	MaterialIcons,
	MaterialCommunityIcons,
	FontAwesome5,
} from "@expo/vector-icons";
import colors from "../themes/colors";
import { sizing } from "../themes/presetStyles";
import { axiosInstance } from "../api/config";

function CheckInScreen({ onClose, bookingId }) {
	const [refNumber, setRefNumber] = useState();

	const fetchRef = () => {
		axiosInstance
			.get(`/api/resourcebookings/${bookingId}/code`)
			.then(({ data }) => {
				setRefNumber(data.code);
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		fetchRef();
	}, []);

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={onClose}>
				<MaterialCommunityIcons
					name="close"
					size={24}
					color={colors.textSecondary}
				/>
			</TouchableOpacity>
			<Text>{refNumber}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: sizing(4),
	},
});

export default CheckInScreen;
