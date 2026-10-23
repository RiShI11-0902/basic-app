
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
};

const STORAGE_KEY = "my_todo_list";

export default function Todo() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load saved todos when the screen opens
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const savedTodos = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedTodos !== null) {
          setTodos(JSON.parse(savedTodos));
        }
      } catch (error) {
        console.log("Error loading todos:", error);
        Alert.alert("Error", "Could not load your saved tasks.");
      } finally {
        setLoaded(true);
      }
    };

    loadTodos();
  }, []);

  // Save todos whenever the list changes
  useEffect(() => {
    if (!loaded) return;

    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(todos)
        );
      } catch (error) {
        console.log("Error saving todos:", error);
        Alert.alert("Error", "Could not save your tasks.");
      }
    };

    saveTodos();
  }, [todos, loaded]);

  // Add a task
  const addTodo = () => {
    const trimmedTask = task.trim();

    if (!trimmedTask) {
      Alert.alert("Empty task", "Please enter a task first.");
      return;
    }

    const newTodo: TodoItem = {
      id: `${Date.now()}-${Math.random()}`,
      title: trimmedTask,
      completed: false,
    };

    setTodos((currentTodos) => [newTodo, ...currentTodos]);
    
    setTask("");
    Keyboard.dismiss();
  };

  // Mark a task as completed or incomplete
  const toggleTodo = (id: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  // Delete a task
  const deleteTodo = (id: string) => {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== id)
    );
  };

  const completedCount = todos.filter(
    (todo) => todo.completed
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Tasks</Text>

      <Text style={styles.subtitle}>
        {completedCount} of {todos.length} tasks completed
      </Text>

      {/* Input section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="#999"
          value={task}
          onChangeText={setTask}
          onSubmitEditing={addTodo}
          returnKeyType="done"
        />

        <Pressable style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      {/* Todo list */}
      {!loaded ? (
        <Text style={styles.message}>Loading tasks...</Text>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            todos.length === 0 ? styles.emptyList : styles.list
          }
          ListEmptyComponent={
            <Text style={styles.message}>
              No tasks yet. Add your first task!
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.todoItem}>
              {/* Complete button */}
              <Pressable
                style={[
                  styles.checkbox,
                  item.completed && styles.checkedBox,
                ]}
                onPress={() => toggleTodo(item.id)}
              >
                {item.completed && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>

              {/* Task title */}
              <Pressable
                style={styles.todoTextContainer}
                onPress={() => toggleTodo(item.id)}
              >
                <Text
                  style={[
                    styles.todoText,
                    item.completed && styles.completedText,
                  ]}
                >
                  {item.title}
                </Text>
              </Pressable>

              {/* Delete button */}
              <Pressable
                style={styles.deleteButton}
                onPress={() => deleteTodo(item.id)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1E293B",
  },
  addButton: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  list: {
    paddingBottom: 20,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
  message: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 15,
    marginTop: 20,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  checkbox: {
    width: 23,
    height: 23,
    borderWidth: 2,
    borderColor: "#94A3B8",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  todoTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  todoText: {
    fontSize: 15,
    color: "#1E293B",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#94A3B8",
  },
  deleteButton: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 7,
  },
  deleteText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "600",
  },
});
