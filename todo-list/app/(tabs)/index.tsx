import { View, FlatList, Alert } from "react-native";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import {
  Card,
  List,
  Checkbox,
  IconButton,
  Text,
  Button,
  Portal,
  Dialog,
  TextInput,
  useTheme,
} from "react-native-paper";
import FloatingAddButton from "../../components/FloatingAddButton";

const STORAGE_KEY = "@todos";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function TasksTab() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState("");
  const theme = useTheme();

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
            title: "Tap the checkbox to complete a task",
            completed: false,
          },
          {
            id: "2",
            title: "Swipe left on a task to see edit/delete actions",
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

  const toggleTask = async (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setEditText(task.title);
  };

  const saveEdit = async () => {
    if (!editingTask || !editText.trim()) return;

    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id ? { ...task, title: editText.trim() } : task
    );
    setTasks(updatedTasks);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error updating task:", error);
    }

    setEditingTask(null);
    setEditText("");
  };

  const deleteAllTasks = () => {
    Alert.alert(
      "Delete All Tasks",
      "Are you sure you want to delete all tasks? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
              setTasks([]);
            } catch (error) {
              console.error("Error deleting tasks:", error);
            }
          },
        },
      ]
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Card style={{ margin: 16, marginBottom: 8 }}>
        <Card.Content>
          <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
            My Tasks
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>
            {completedCount} of {tasks.length} completed
          </Text>
        </Card.Content>
      </Card>

      {tasks.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.secondary, textAlign: "center" }}
          >
            No tasks yet!
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.secondary,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Tap the + button to add your first task
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <Card style={{ marginHorizontal: 8, marginVertical: 4 }}>
              <List.Item
                title={item.title}
                titleNumberOfLines={3}
                titleStyle={{
                  textDecorationLine: item.completed ? "line-through" : "none",
                  color: item.completed
                    ? theme.colors.secondary
                    : theme.colors.onSurface,
                }}
                left={() => (
                  <Checkbox
                    status={item.completed ? "checked" : "unchecked"}
                    onPress={() => toggleTask(item.id)}
                  />
                )}
                right={() => (
                  <View style={{ flexDirection: "row" }}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => startEdit(item)}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      iconColor={theme.colors.error}
                      onPress={() => deleteTask(item.id)}
                    />
                  </View>
                )}
              />
            </Card>
          )}
        />
      )}

      {tasks.length > 0 && (
        <View style={{ padding: 16, paddingBottom: 80 }}>
          <Button
            mode="outlined"
            onPress={deleteAllTasks}
            textColor={theme.colors.error}
            style={{ borderColor: theme.colors.error }}
          >
            Delete All Tasks
          </Button>
        </View>
      )}

      <FloatingAddButton onAddTask={addTask} />

      <Portal>
        <Dialog visible={!!editingTask} onDismiss={() => setEditingTask(null)}>
          <Dialog.Title>Edit Task</Dialog.Title>
          <Dialog.Content>
            <TextInput
              value={editText}
              onChangeText={setEditText}
              mode="outlined"
              placeholder="Task title"
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditingTask(null)}>Cancel</Button>
            <Button onPress={saveEdit}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
