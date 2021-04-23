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
		checked: "已簽到",
		checkedIn: "已簽到 ({{value}})",
		checkIn: "簽到",
		lateCheckIn: "已簽到 (遲了{{value}}分鐘)",
		late: "已簽到 (遲到 {{value}})",
		notCheckIn: "未簽到",
		short: "{{label}}應該至少要有{{value}}字母",
		required: "{{label}}是必填的",
	},
	app: {
		noInternet: "沒有網絡連接！",
		noInternetDescription: "在使用roomac前，請先連接網絡。",
		biometrics: "驗證以繼續身份驗證.",
		biometricsFailed: "驗證失敗",
		bioNeeded: "您需要使用身份驗證登錄。",
		error: "出現故障！",
		errorDescription: "請重新啟動應用程式，並再次嘗試",
	},
	Login: {
		email: "電子郵件，CNA",
		password: "密碼",
		welcomeTo: "歡迎來到",
		failedDescription: "電子郵件/CNA或密碼錯誤。",
		forgot: "忘記密碼？",
		banTitle: "帳戶被禁止",
		banDescription: "您的帳戶被禁止使用，直到{{value}}。",
	},
	Drawer: {
		home: "首頁",
		bookings: "我的預約",
		campuses: "院校",
		settings: "設定",
	},
	[routes.screens.HOME]: {
		welcome: "歡迎， {{value}}",
		searchTitle: "搜索資源",
		today: "今天",
		categories: "類別",
		resources: "資源 ({{value}})",
		campuses: "院校",
	},
	[routes.screens.DETAILED_RESOURCES]: {
		distance: " • {{value}} 公里遠",
		opened: "開放",
		closed: "不開放",
		availability: "空置",
		availabilityDescriptoin: "請按下您想選取的時段已創建您的預約。",
		campusLocation: "院校位置 ({{value}})",
		resources: "資源",
		available: "可用",
		booked: "已預訂",
		past: "已過去",
	},
	[routes.screens.CREATE_BOOKING]: {
		selectTime: "選擇時間",
		tos: "條款及細則",
		confirmBooking: "確認預約",
		bookingResults: "預約結果",
		next: "下一步",
		back: "返回",
		accept: "接受",
		submit: "提交",
		viewBookings: "瀏覽我的預約",
		results_failed: "失敗...",
		results_successful: "成功！",
		results_bookingRef: "登記編號: {{value}}",
		confirm_description: "請檢查並確認以下預約。",
		lastStep: "最後一步，快要完成了！",
		deleteTime: "刪除時段",
		deleteTimeDescription:
			"刪除時段({{value1}})也會刪除在{{value2}}之後的時段",
		extend: "延長至{{value}}",
		changeTime: "選擇時間",
	},
	[routes.screens.VIEW_BOOKINGS]: {
		myBookings: "我的預約",
		active: "現在",
		upcoming: "即將來臨",
		history: "預約記錄",
		pastDays: "過去 {{value}} 日",
		checkIn: "簽到",
		noBookings: "您暫時沒有預約",
		browse: "瀏覽資源",
	},
	[routes.screens.BOOKING_DETAILS]: {
		checkIn: "簽到",
		checkInAvailable: "{{value}} 後可簽到",
		tos: "條款及細則",
		editDescription: "通過編輯此預約，您將失去目前的預約。",
		continue: "繼續",
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
	[routes.screens.CHECKIN]: {
		description: "請將QR碼顯示在掃描儀上以進行登記。",
	},
	[routes.screens.SEARCH]: {
		title: "搜索資源",
		searchPlaceholder: "搜索資源",
		noResults: "沒有結果",
	},
	[routes.screens.CAMPUS_RESOURCES]: {
		campusTitle: "{{value}} 院校",
		searchPlaceholder: "在{{value}}學院上搜索資源",
	},
	[routes.screens.CAMPUS_LOCATIONS]: {
		campusResources: "院校資源",
	},
};
