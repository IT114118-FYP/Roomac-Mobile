import routes from "../../navigations/routes";

export default {
	common: {
		roomac: "roomac",
		pullToRefresh: "pull to refresh",
		timeslot_sameDay: "[Today]",
		timeslot_nextDay: "[Tomorrow]",
		success: "Successful",
		failed: "Failed",
		signIn: "Sign In",
		logout: "Log out",
		ok: "Ok",
		today: "Today",
		now: "Now",
		back: "Back",
	},
	app: {
		noInternet: "No Internet connection!",
		noInternetDescription:
			"Turn on Internet connection before using roomac.",
		biometrics: "Verify to continue authentication.",
		biometricsFailed: "Authentication Failed",
		error: "Something went wrong!",
		errorDescription: "Restart the App and try again",
	},
	Login: {
		email: "Email / CNA",
		password: "Password",
		welcomeTo: "Welcome To",
		failedDescription: "Email/CNA or password is incorrect.",
		forgot: "Forgot your password?",
	},
	Drawer: {
		home: "Home",
		bookings: "My Bookings",
		campuses: "Campuses",
		settings: "Settings",
	},
	[routes.screens.HOME]: {
		welcome: "Welcome, {{value}}",
		searchTitle: "Help me find a resource",
		today: "Today",
		categories: "Categories",
		resources: "Resources ({{value}})",
		campuses: "Campuses",
	},
	[routes.screens.DETAILED_RESOURCES]: {
		distance: " • {{value}} km away",
		opened: "opened",
		closed: "closed",
		availability: "Availability",
		availabilityDescriptoin:
			"Press on the preferred timeslot to create your booking.",
		campusLocation: "Campus Location ({{value}})",
		contactAdmin: "Contact Admin",
		contactAdminDescription: "Feel free to contact admin if help is needed",
	},
	[routes.screens.CREATE_BOOKING]: {
		selectTime: "Select Time",
		tos: "Terms & Conditions",
		confirmBooking: "Confirm Booking",
		bookingResults: "Booking Results",
		next: "Next",
		accept: "Accept",
		submit: "Submit",
		viewBookings: "View in My Bookings",
		results_failed: "Failed...",
		results_successful: "Successful!",
		results_bookingRef: "Booking Reference: {{value}}",
		confirm_description: "Please check and confirm the following booking.",
		lastStep: "Last step, almost finish!",
	},
	[routes.screens.VIEW_BOOKINGS]: {
		myBookings: "My Bookings",
		active: "Active",
		upcoming: "Upcoming",
		history: "History",
		pastDays: "Past {{value}} days",
		checkIn: "Check In",
		noBookings: "You do not have any bookings for now.",
		browse: "Browse Resources",
	},
	[routes.screens.BOOKING_DETAILS]: {
		checkIn: "Check In",
		checkInAvailable: "Check in available after {{value}}",
		tos: "Terms & Conditions",
	},
	[routes.screens.SETTINGS]: {
		settings: "Settings",
		language: "Change Language",
		password: "Change Password",
		tos: "Terms & Conditions",
		bio: "Sign in with Touch ID / Face ID",
		logout: "Log out",
		logoutConfirm: "Are you sure you want to log out?",
		cancel: "Cancel",
	},
	[routes.screens.CHANGE_PASSWORD]: {
		old: "Old Password",
		new: "New Password",
		passwordRequirement:
			"Must Contain 8 Characters, One Uppercase, One Lowercase and one Number",
		passwordMatch: "Password must match",
		changeSuccessText: "Password changed, sign in now with new password",
		changeFailedText: "Password change failed, please try again",
		title: "Change Password",
		enterOld: "Enter old password",
		enterNew: "Enter new password",
		confirmNew: "Confirm new password",
		submit: "Submit New Password",
	},
	[routes.screens.CHANGE_LANGUAGE]: {
		title: "Change Language",
		reset: "Reset Language",
		default: " | default",
	},
	[routes.screens.CHECKIN]: {
		description: "Display the QR code to the scanner to check in.",
	},
	[routes.screens.SEARCH]: {
		title: "Search Resources",
		searchPlaceholder: "Help me find a resource",
		noResults: "No Results",
	},
};
