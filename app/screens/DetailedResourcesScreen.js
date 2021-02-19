import React, { Component, useEffect, useRef, useState } from "react";
import {
	View,
	StyleSheet,
	Image,
	Text,
	TouchableOpacity,
	StatusBar,
	Platform,
	ScrollView,
	FlatList,
	Dimensions,
} from "react-native";
import ImageHeaderScrollView, {
	TriggeringView,
} from "react-native-image-header-scroll-view";
import * as Animatable from "react-native-animatable";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../themes/colors";
import presetStyles, { sizing } from "../themes/presetStyles";
import TimeSlot from "../components/TimeSlot";
import { axiosInstance } from "../api/config";
import moment from "moment";

const MIN_HEIGHT = Platform.OS === "ios" ? 70 : 55;
const MAX_HEIGHT = 200;

const { width } = Dimensions.get("window");

const TIMESLOT_WIDTH = width * sizing(0.2);

class ImageHeaderWrapper extends Component {
	render() {
		return (
			<View style={styles.container}>
				<ImageHeaderScrollView
					maxHeight={MAX_HEIGHT}
					minHeight={MIN_HEIGHT}
					useNativeDriver
					minOverlayOpacity={0.1}
					maxOverlayOpacity={0.4}
					renderHeader={() => (
						<Image
							source={{
								uri: this.props.imageUrl,
							}}
							style={styles.image}
						/>
					)}
					renderForeground={() => (
						<View
							style={{
								height: MAX_HEIGHT,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text style={styles.headerTitle}>
								{this.props.headerTitle}
							</Text>
						</View>
					)}
					renderFixedForeground={() => {
						<View style={styles.navTitleView}>
							<Text style={styles.navTitle}>
								{this.props.headerTitle}
							</Text>
						</View>;
					}}
				>
					<StatusBar barStyle="light-content" animated={true} />
					<TriggeringView
						style={{
							backgroundColor: "red",
						}}
						// onHide={() =>
						// 	this.navigationTitleView.current.fadeInUp(200)
						// }
						// onDisplay={() =>
						// 	this.navigationTitleView.current.fadeOut(100)
						// }
					>
						{/* <Text style={styles.title}>
							{this.props.headerTitle}
						</Text> */}
					</TriggeringView>
					{this.props.children}
				</ImageHeaderScrollView>
			</View>
		);
	}
}

function DetailedResourcesScreen({ route, navigation }) {
	const { item } = route.params;
	const [isLoading, setLoading] = useState(true);
	const [timeslot, setTimeslot] = useState({});

	const closeTimeindicator = () => {
		const diff = moment(item.closing_time, "HH:mm:ss").diff(
			moment(),
			"hours"
		);
		if (diff > 0) {
			return `${Math.abs(diff)} hours before closing`;
		} else {
			return "closed";
		}
	};

	useEffect(() => {
		fetchTimeslot();
		console.log(moment(item.closing_time, "HH:mm:ss").diff(moment()));
	}, []);

	const fetchTimeslot = () => {
		setLoading(true);
		const startDate = moment().format("YYYY-MM-DD");
		const endDate = moment().add(10, "days").format("YYYY-MM-DD");

		axiosInstance
			.get(
				`/api/resources/${item.id}/bookings?start=${startDate}&end=${endDate}`
			)
			.then(({ data }) => {
				let events = [];
				for (let i in data.allow_times) {
					let allow_time = data.allow_times[i];
					for (let date in allow_time) {
						let times = allow_time[date];
						let eventSlot = [];
						for (let j in times) {
							eventSlot.push({
								id: times[j].id,
								start: times[j].start_time,
								end: times[j].end_time,
								available: times[j].available,
							});
						}
						events.push({
							date: date,
							timeslot: eventSlot,
						});
					}
				}
				// console.log(events);
				setTimeslot(events);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<ScrollView>
			{/* <ImageHeaderWrapper
                imageUrl={item.image_url}
                headerTitle={`${item.number} ${item.title_en}`}
            > */}
			<StatusBar barStyle="light-content" animated={true} />
			<Image
				source={{
					uri: item.image_url,
				}}
				style={styles.image}
			/>
			<View style={styles.detailContainer}>
				<Text
					style={styles.title}
				>{`${item.number} ${item.title_en}`}</Text>
			</View>
			<View style={presetStyles.marginHorizontal}>
				<View style={[presetStyles.row, { marginTop: sizing(1.5) }]}>
					<MaterialIcons
						name="location-on"
						size={sizing(4)}
						color={colors.textSecondary}
					/>
					<Text
						style={{
							color: colors.textSecondary,
							marginLeft: sizing(2),
						}}
					>
						{item.branch.title_en} • 6.17 km away
					</Text>
				</View>
				<View style={[presetStyles.row, { marginTop: sizing(1.5) }]}>
					<MaterialCommunityIcons
						name="clock"
						size={sizing(4)}
						color={colors.textSecondary}
					/>
					<Text
						style={{
							color: colors.textSecondary,
							marginLeft: sizing(1.5),
						}}
					>
						{moment(item.opening_time, "HH:mm:ss").format("H:mm")} -{" "}
						{moment(item.closing_time, "HH:mm:ss").format("H:mm")} •{" "}
						{closeTimeindicator()}
					</Text>
				</View>
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
					>{`${item.min_user} - ${item.max_user}`}</Text>
				</View>
			</View>
			{!isLoading && (
				<>
					<Animatable.Text
						animation="fadeIn"
						style={[
							presetStyles.listHeader,
							styles.marginHorizontal,
							{
								marginTop: sizing(4),
							},
						]}
					>
						Availability
					</Animatable.Text>
					<FlatList
						horizontal
						snapToInterval={TIMESLOT_WIDTH + sizing(6)}
						decelerationRate="fast"
						showsHorizontalScrollIndicator={false}
						pagingEnabled
						data={timeslot}
						keyExtractor={(item) => `${item.date}`}
						renderItem={({ item }) => (
							<Animatable.View
								style={styles.wrapper}
								animation={{
									0: {
										opacity: 0,
										scale: 0.5,
									},
									1: {
										opacity: 1,
										scale: 1,
									},
								}}
							>
								<TimeSlot data={item} />
							</Animatable.View>
						)}
					/>
				</>
			)}
			{/* </ImageHeaderWrapper> */}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	detailContainer: {
		marginHorizontal: sizing(6),
		marginTop: sizing(4),
	},
	image: {
		height: MAX_HEIGHT,
		resizeMode: "cover",
	},
	title: {
		fontSize: 24,
		fontWeight: "500",
		// margin: 15,
	},
	marginHorizontal: {
		marginHorizontal: sizing(6),
	},
});

export default DetailedResourcesScreen;
