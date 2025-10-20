import { View, Text, FlatList, Button, Alert } from "react-native";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import FloatingAddButton from "../../components/FloatingAddButton";

const STORAGE_KEY = "@todos";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function TasksTab() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setTasks(JSON.parse(jsonValue));
      } else {
        const sampleTasks = [
          {
            id: "1",
            title: "Long press to delete the task...",
            completed: false,
          },
        ];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTasks));
        setTasks(sampleTasks);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const addTask = async (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const deleteAllTasks = () => {
    Alert.alert(
      "Delete All Tasks",
      "Are you sure you want to delete all tasks? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              const placeholderTask = [
                {
                  id: "1",
                  title: "Long press to delete the task...",
                  completed: false,
                },
              ];
              await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(placeholderTask)
              );
              setTasks(placeholderTask);
            } catch (error) {
              console.error("Error deleting tasks:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>My Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.title}</Text>
          </View>
        )}
      />

      <View style={{ marginTop: 20, marginBottom: 80 }}>
        <Button title="Delete All Tasks" onPress={deleteAllTasks} color="red" />
      </View>

      <FloatingAddButton onAddTask={addTask} />
    </View>
  );
}
