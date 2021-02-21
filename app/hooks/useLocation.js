import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { getDistance } from "geolib";

export default useLocation = () => {
	const [location, setLocation] = useState();
	// const [isReady, setIsReady] = useState(false);
	// const [distance, setDistance] = useState();

	const calculateDistance = () => {
		const dist = getDistance(
			{ latitude: location.latitude, longitude: location.longitude },
			{ latitude, longitude }
		);
		setDistance(Math.round((dist / 1000 + Number.EPSILON) * 100) / 100);
	};

	const getLocation = async () => {
		try {
			const { granted } = await Location.requestPermissionsAsync();
			if (!granted) {
				setIsReady(false);
				return;
			}
			const {
				coords: { latitude, longitude },
			} = await Location.getLastKnownPositionAsync();
			setLocation({ latitude, longitude });
			// calculateDistance();
			setIsReady(true);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getLocation();
		// calculateDistance();
	}, []);

	return location;
};
