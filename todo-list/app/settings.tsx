import { ScrollView } from "react-native";
import {
  Card,
  Text,
  List,
  Switch,
  Divider,
  useTheme,
  Avatar,
} from "react-native-paper";
import { useState } from "react";

export default function SettingsTab() {
  const theme = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Card style={{ margin: 16 }}>
        <Card.Content style={{ alignItems: "center", paddingVertical: 24 }}>
          <Avatar.Icon size={80} icon="account" />
          <Text variant="headlineSmall" style={{ marginTop: 16 }}>
            Settings
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>
            Customize your app experience
          </Text>
        </Card.Content>
      </Card>

      <Card style={{ margin: 16 }}>
        <Card.Content>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            Preferences
          </Text>

          <List.Item
            title="Notifications"
            description="Receive reminders for tasks"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch value={notifications} onValueChange={setNotifications} />
            )}
          />
          <Divider />

          <List.Item
            title="Dark Mode"
            description="Use dark theme"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch value={darkMode} onValueChange={setDarkMode} />
            )}
          />
          <Divider />

          <List.Item
            title="Sound Effects"
            description="Play sounds for actions"
            left={(props) => <List.Icon {...props} icon="volume-high" />}
            right={() => (
              <Switch value={soundEffects} onValueChange={setSoundEffects} />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={{ margin: 16 }}>
        <Card.Content>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            About
          </Text>

          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <Divider />

          <List.Item
            title="Help & Support"
            description="Get help with the app"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />

          <List.Item
            title="Privacy Policy"
            description="View our privacy policy"
            left={(props) => <List.Icon {...props} icon="shield-check" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
