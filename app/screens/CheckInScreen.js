import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Dimensions,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import * as Animatable from "react-native-animatable";

import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import { axiosInstance } from "../api/config";
import { useTranslation } from "react-i18next";
import routes from "../navigations/routes";

const { width } = Dimensions.get("window");
const QRCodeSize = width * 0.8;

function CheckInScreen({ onClose, bookingId, date, time }) {
	const { t } = useTranslation([routes.screens.CHECKIN]);
	const [refNumber, setRefNumber] = useState();
	const [isLoading, setLoading] = useState(true);

	const fetchRef = () => {
		setLoading(true);
		axiosInstance
			.get(`/api/resourcebookings/${bookingId}/code`)
			.then(({ data }) => {
				console.log(data);
				setRefNumber(data.code);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchRef();
	}, []);

	return (
		<ScrollView style={styles.container}>
			<TouchableOpacity onPress={onClose}>
				<MaterialCommunityIcons
					name="close"
					size={sizing(7)}
					color={colors.textSecondary}
				/>
			</TouchableOpacity>
			<View
				style={[
					presetStyles.row,
					presetStyles.marginHorizontal,
					styles.detailsContainer,
				]}
			>
				<View style={[styles.details]}>
					<Text style={styles.date}>{date}</Text>
					<Text style={styles.title}>{time}</Text>
				</View>
				<TouchableOpacity onPress={fetchRef}>
					<MaterialCommunityIcons
						name="reload"
						size={sizing(5)}
						color={colors.textSecondary}
					/>
				</TouchableOpacity>
			</View>
			<View style={styles.qrcontainer}>
				{isLoading ? (
					<View
						style={{
							width: QRCodeSize,
							height: QRCodeSize,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<ActivityIndicator size="large" />
					</View>
				) : (
					<Animatable.View animation="fadeIn">
						<QRCode
							value={refNumber}
							size={QRCodeSize}
							backgroundColor={"rgba(255, 255, 255, 0)"}
						/>
					</Animatable.View>
				)}
			</View>
			<Text style={[presetStyles.marginHorizontal, styles.description]}>
				{t("description")}
			</Text>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: sizing(4),
	},
	qrcontainer: {
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: sizing(10),
	},
	detailsContainer: {
		marginTop: sizing(6),
	},
	details: {
		flex: 1,
	},
	date: {
		fontSize: sizing(4),
		fontWeight: "400",
		color: colors.textSecondary,
	},
	title: {
		fontSize: sizing(7),
		fontWeight: "600",
	},
	description: {
		fontSize: sizing(4.5),
		color: colors.textSecondary,
	},
});

export default CheckInScreen;
