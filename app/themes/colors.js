const lightColors = {
	primary: "#50449C",
	secondary: "#3FC0B6",
	textPrimary: "#0e0e0e",
	textSecondary: "#848484",
	backgroundPrimary: "#FFFFFF",
	backgroundSecondary: "#f9fbff",
	Cyber_Grape: "#564787",
	Languid_Lavende: "#dbcbd8",
	Azure: "#f2fdff",
	Powder_Blue: "#9ad4d6",
	Oxford_Blue: "#101935",
	Light_Orange: "#f1b90e",
	danger: "#df3a09",
};

const darkColors = {
	primary: "#6156a5",
	secondary: "#3FC0B6",
	textPrimary: "#C9D1D9",
	textSecondary: "#8B949E",
	backgroundPrimary: "#0D1117",
	backgroundSecondary: "#161B22",
	Cyber_Grape: "#564787",
	Languid_Lavende: "#dbcbd8",
	Azure: "#f2fdff",
	Powder_Blue: "#9ad4d6",
	Oxford_Blue: "#101935",
	Light_Orange: "#f1b90e",
	danger: "#df3a09",
};

const colors = (colorScheme = "light") =>
	colorScheme === "light" ? lightColors : darkColors;

export default colors;

// useColorScheme
// const colorScheme = useColorScheme();
