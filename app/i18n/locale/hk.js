import routes from "../../navigations/routes";

export default {
	common: {
		roomac: "roomac",
		pullToRefresh: "向下滑動已刷新",
		timeslot_sameDay: "[今天]",
		timeslot_nextDay: "[明天]",
		success: "成功",
		failed: "失敗",
		signIn: "登入",
		logout: "登出",
		ok: "確認",
		today: "今天",
		now: "現在",
	},
	app: {
		noInternet: "沒有網絡連接！",
		noInternetDescription: "在使用roomac前，請先連接網絡。",
		biometrics: "驗證以繼續身份驗證.",
		biometricsFailed: "驗證失敗",
		error: "出現故障！",
		errorDescription: "請重新啟動應用程式，並再次嘗試",
	},
	Login: {
		email: "電子郵件/CNA",
		password: "密碼",
		welcomeTo: "歡迎來到",
		failedDescription: "電子郵件/CNA或密碼錯誤。",
		forgot: "忘記密碼？",
	},
	Drawer: {
		home: "首頁",
		bookings: "我的預約",
		campuses: "學院",
		settings: "設定",
	},
	[routes.screens.HOME]: {
		welcome: "歡迎， {{value}}",
		searchTitle: "尋找資源",
		today: "今天",
		categories: "類別",
		resources: "資源 ({{value}})",
	},
	[routes.screens.DETAILED_RESOURCES]: {
		distance: " • {{value}} 公里遠",
		opened: "開放",
		closed: "不開放",
		availability: "空置",
		availabilityDescriptoin: "請按下您想選取的時段已創建您的預約。",
		campusLocation: "學院位置 ({{value}})",
		contactAdmin: "聯絡管理員",
		contactAdminDescription: "如果需要幫助，請隨時與管理員聯繫",
	},
	[routes.screens.CREATE_BOOKING]: {
		selectTime: "選擇時間",
		tos: "條款及細則",
		confirmBooking: "確認預約",
		bookingResults: "預約結果",
		next: "下一步",
		accept: "接受",
		submit: "提交",
		viewBookings: "瀏覽我的預約",
		results_failed: "失敗...",
		results_successful: "成功！",
		results_bookingRef: "Booking Reference: {{value}}",
		confirm_description: "請檢查並確認以下預約。",
		lastStep: "最後一步，快要完成了！",
	},
	[routes.screens.VIEW_BOOKINGS]: {
		myBookings: "我的預約",
		active: "現在",
		upcoming: "即將來臨",
		history: "預約記錄",
		pastDays: "過去 {{value}} 日",
		checkIn: "登記",
		noBookings: "您暫時沒有預約",
		browse: "瀏覽資源",
	},
	[routes.screens.BOOKING_DETAILS]: {
		checkIn: "登記",
		checkInAvailable: "{{value}} 後可登記",
		tos: "條款及細則",
	},
	[routes.screens.SETTINGS]: {
		settings: "設定",
		language: "更改語言",
		password: "更改密碼",
		tos: "條款及細則",
		bio: "使用Touch ID或Face ID登入",
		logout: "登出",
		logoutConfirm: "您確定要登出？",
		cancel: "取消",
	},
	[routes.screens.CHANGE_PASSWORD]: {
		old: "舊密碼",
		new: "新密碼",
		passwordRequirement:
			"必須包含8個字符，一個大寫字母，一個小寫字母和一個數字",
		passwordMatch: "密碼必須相符",
		changeSuccessText: "密碼已更改，請使用新密碼登入",
		changeFailedText: "密碼更改操作失敗，請再次嘗試",
		title: "更改密碼",
		enterOld: "輸入舊密碼",
		enterNew: "輸入新密碼",
		confirmNew: "確認新密碼",
		submit: "提交新密碼",
	},
	[routes.screens.CHANGE_LANGUAGE]: {
		title: "更改語言",
		reset: "重設語言",
		default: " | 預設",
	},
};