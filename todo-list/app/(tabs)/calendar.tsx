import { View, ScrollView, Alert } from "react-native";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import {
  Card,
  Text,
  useTheme,
  List,
  Chip,
  IconButton,
} from "react-native-paper";
import FloatingAddButton from "../../components/FloatingAddButton";

const STORAGE_KEY = "@todos";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export default function CalendarTab() {
  const theme = useTheme();
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadCompletedTasks();
    }, [])
  );

  const loadCompletedTasks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        const allTasks: Task[] = JSON.parse(jsonValue);
        const completed = allTasks
          .filter((task) => task.completed)
          .sort((a, b) => {
            // Sort by completion date, most recent first
            const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
            const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
            return dateB - dateA;
          });
        setCompletedTasks(completed);
      }
    } catch (error) {
      console.error("Error loading completed tasks:", error);
    }
  };

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
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const deleteCompletedTask = async (id: string) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this completed task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
              const allTasks: Task[] = jsonValue ? JSON.parse(jsonValue) : [];
              const updatedTasks = allTasks.filter((task) => task.id !== id);
              await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updatedTasks)
              );

              // Refresh the completed tasks list
              loadCompletedTasks();
            } catch (error) {
              console.error("Error deleting task:", error);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Card style={{ margin: 16 }}>
        <Card.Content>
          <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
            Completed Tasks
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>
            {completedTasks.length} completed tasks
          </Text>
        </Card.Content>
      </Card>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {completedTasks.length === 0 ? (
          <Card>
            <Card.Content style={{ alignItems: "center", paddingVertical: 40 }}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.secondary, textAlign: "center" }}
              >
                No completed tasks yet
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.secondary,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Complete tasks by swiping left on them in the Tasks tab
              </Text>
            </Card.Content>
          </Card>
        ) : (
          completedTasks.map((task) => (
            <Card
              key={task.id}
              style={{
                marginBottom: 12,
                backgroundColor: theme.colors.surfaceVariant,
              }}
            >
              <Card.Content
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                }}
              >
                <List.Icon icon="check-circle" color={theme.colors.primary} />
                <Text
                  variant="bodyLarge"
                  style={{ flex: 1, marginLeft: 8 }}
                  numberOfLines={3}
                >
                  {task.title}
                </Text>
                <Chip
                  mode="flat"
                  compact
                  style={{
                    backgroundColor: theme.colors.primaryContainer,
                    marginRight: 8,
                  }}
                  textStyle={{ fontSize: 11 }}
                >
                  {formatDate(task.completedAt)}
                </Chip>
                <IconButton
                  icon="delete"
                  iconColor={theme.colors.error}
                  size={20}
                  onPress={() => deleteCompletedTask(task.id)}
                  style={{ margin: 0 }}
                />
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FloatingAddButton onAddTask={handleAddTask} />
    </View>
  );
}
