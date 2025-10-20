import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, Text, useTheme, Banner } from "react-native-paper";
import FloatingAddButton from "../../components/FloatingAddButton";

const STORAGE_KEY = "@todos";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function CalendarTab() {
  const theme = useTheme();

  const handleAddTask = async (title: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      const existingTasks: Task[] = jsonValue ? JSON.parse(jsonValue) : [];

      const newTask: Task = {
        id: Date.now().toString(),
        title,
        completed: false,
      };

      const updatedTasks = [...existingTasks, newTask];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));

      alert("Task added! Go to Tasks tab to see it.");
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Card style={{ margin: 16 }}>
        <Card.Content>
          <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
            Calendar
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>
            Your schedule and upcoming tasks
          </Text>
        </Card.Content>
      </Card>

      <View style={{ padding: 16 }}>
        <Banner
          visible={true}
          icon="calendar-clock"
          style={{ marginBottom: 16 }}
        >
          Calendar view coming soon! You can still add tasks using the + button.
        </Banner>

        <Card>
          <Card.Cover
            source={{ uri: "https://picsum.photos/700/300?calendar" }}
          />
          <Card.Content style={{ marginTop: 16 }}>
            <Text variant="titleMedium">Coming Features</Text>
            <Text
              variant="bodyMedium"
              style={{ marginTop: 8, color: theme.colors.secondary }}
            >
              • View tasks by date{"\n"}• Set due dates and reminders{"\n"}•
              Monthly/weekly calendar view{"\n"}• Recurring tasks
            </Text>
          </Card.Content>
        </Card>
      </View>

      <FloatingAddButton onAddTask={handleAddTask} />
    </View>
  );
}
