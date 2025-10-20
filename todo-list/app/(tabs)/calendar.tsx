import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FloatingAddButton from "../../components/FloatingAddButton";

const STORAGE_KEY = "@todos";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function CalendarTab() {
  const handleAddTask = async (title: string) => {
    try {
      // Load existing tasks
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      const existingTasks: Task[] = jsonValue ? JSON.parse(jsonValue) : [];

      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        completed: false,
      };

      // Add to existing tasks
      const updatedTasks = [...existingTasks, newTask];

      // Save back to storage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));

      alert("Task added! Go to Tasks tab to see it.");
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Calendar</Text>
      <Text>Calendar view coming soon...</Text>

      <FloatingAddButton onAddTask={handleAddTask} />
    </View>
  );
}
