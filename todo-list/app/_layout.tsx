// app/_layout.tsx
import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          title: "Home",
        }}
      />
      <Drawer.Screen
        name="calendar"
        options={{
          headerShown: false,
          title: "Calendar",
        }}
      />
    </Drawer>
  );
}
