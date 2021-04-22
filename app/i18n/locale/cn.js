import routes from "../../navigations/routes";

export default {
	common: {
		roomac: "roomac",
		pullToRefresh: "下拉刷新",
		timeslot_sameDay: "[今天]",
		timeslot_nextDay: "[明天]",
		success: "成功",
		failed: "失败",
		signIn: "登入",
		logout: "登出",
		ok: "确认",
		today: "今天",
		now: "现在",
		checked: "已签到",
		checkedIn: "已签到 ({{value}})",
		checkIn: "签到",
		lateCheckIn: "已签到 (迟了{{value}}分钟)",
		late: "已签到 (迟了 {{value}})",
		notCheckIn: "未签到",
		short: "{{label}}应该至少要有{{value}}字母",
		required: "{{label}}是必填的",
	},
	app: {
		noInternet: "没有网络连接！",
		noInternetDescription: "使用Roomac之前，请先打开网络连接。",
		biometrics: "验证以继续身份验证",
		biometricsFailed: "验证失败",
		error: "发生错误了！",
		errorDescription: "请重新启动应用程序，然后重试",
	},
	Login: {
		email: "电子邮件，CNA",
		password: "密码",
		welcomeTo: "欢迎来到",
		failedDescription: "电子邮件/CNA或密码不正确。",
		forgot: "忘记密码？",
		banTitle: "帐户被禁止",
		banDescription: "您的帐户被禁止使用，直到{{value}}。",
	},
	Drawer: {
		home: "首页",
		bookings: "我的预约",
		campuses: "院校",
		settings: "设定",
	},
	[routes.screens.HOME]: {
		welcome: "欢迎， {{value}}",
		searchTitle: "搜索资源",
		today: "今天",
		categories: "类别",
		resources: "资源 ({{value}})",
		campuses: "院校",
	},
	[routes.screens.DETAILED_RESOURCES]: {
		distance: " • {{value}} 公里远",
		opened: "开了",
		closed: "关闭",
		availability: "空置",
		availabilityDescriptoin: "请按下您想选取的时段已创建您的预约。",
		campusLocation: "院校位置 ({{value}})",
		resources: "资源",
	},
	[routes.screens.CREATE_BOOKING]: {
		selectTime: "选择时间",
		tos: "条款及细则",
		confirmBooking: "确认预约",
		bookingResults: "预约结果",
		next: "下一步",
		back: "返回",
		accept: "接受",
		submit: "提交",
		viewBookings: "浏览我的预约",
		results_failed: "失败...",
		results_successful: "成功！",
		results_bookingRef: "登记编号: {{value}}",
		confirm_description: "请检查并确认以下预约。",
		lastStep: "最后一步，快要完成了！",
		deleteTime: "删除时段",
		deleteTimeDescription:
			"删除时段({{value1}})也会删除在{{value2}}之后的时段",
		extend: "延长至{{value}}",
		changeTime: "选择时间",
	},
	[routes.screens.VIEW_BOOKINGS]: {
		myBookings: "我的预约",
		active: "现在",
		upcoming: "即将来临",
		history: "预约记录",
		pastDays: "过去 {{value}} 日",
		checkIn: "签到",
		noBookings: "您暂时没有预约",
		browse: "浏览资源",
	},
	[routes.screens.BOOKING_DETAILS]: {
		checkIn: "签到",
		checkInAvailable: "{{value}} 后可登记",
		tos: "条款及细则",
		editDescription: "通过编辑此预约，您将失去目前的预约。",
		continue: "继续",
	},
	[routes.screens.SETTINGS]: {
		settings: "设定",
		language: "更改语言",
		password: "更改密码",
		tos: "条款及细则",
		bio: "使用指纹识别功能或脸部辨识系统登入",
		logout: "登出",
		logoutConfirm: "您确定要登出？",
		cancel: "取消",
	},
	[routes.screens.CHANGE_PASSWORD]: {
		old: "旧密码",
		new: "新密码",
		passwordRequirement:
			"必须包含8个字符，一个大写字母，一个小写字母和一个数字",
		passwordMatch: "密码必须相符",
		changeSuccessText: "密码已更改，请使用新密码登入",
		changeFailedText: "密码更改操作失败，请再次尝试",
		title: "更改密码",
		enterOld: "输入旧密码",
		enterNew: "输入新密码",
		confirmNew: "确认新密码",
		submit: "提交新密码",
	},
	[routes.screens.CHANGE_LANGUAGE]: {
		title: "更改语言",
		reset: "重设语言",
		default: " | 预设",
	},
	[routes.screens.CHECKIN]: {
		description: "请将QR码显示在扫描仪上以进行登记。",
	},
	[routes.screens.SEARCH]: {
		title: "搜索资源",
		searchPlaceholder: "搜索资源",
		noResults: "没有结果",
	},
	[routes.screens.CAMPUS_RESOURCES]: {
		campusTitle: "{{value}} 院校",
		searchPlaceholder: "在{{value}}学院上搜索资源",
	},
	[routes.screens.CAMPUS_LOCATIONS]: {
		campusResources: "院校资源",
	},
};
