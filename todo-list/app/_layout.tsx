import { Drawer } from "expo-router/drawer";
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { useColorScheme } from "react-native";

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#6750A4",
    secondary: "#625B71",
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#D0BCFF",
    secondary: "#CCC2DC",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <Drawer>
        <Drawer.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            title: "Home",
            drawerLabel: "Tasks & Calendar",
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: "Settings",
            drawerLabel: "Settings",
          }}
        />
      </Drawer>
    </PaperProvider>
  );
}
