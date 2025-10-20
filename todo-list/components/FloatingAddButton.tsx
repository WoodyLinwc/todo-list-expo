import { Pressable, Text, Modal, View, TextInput, Button } from "react-native";
import { useState } from "react";

interface Props {
  onAddTask: (title: string) => void;
}

export default function FloatingAddButton({ onAddTask }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleOpen = () => {
    setInputText(""); // Clear input when opening modal
    setModalVisible(true);
  };

  const handleCancel = () => {
    setInputText(""); // Clear input when canceling
    setModalVisible(false);
  };

  const handleAdd = () => {
    if (inputText.trim()) {
      onAddTask(inputText.trim());
      setInputText(""); // Clear input after adding
      setModalVisible(false);
    }
  };

  return (
    <>
      <Pressable
        onPress={handleOpen}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          backgroundColor: "blue",
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 30 }}>+</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              width: "80%",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 20, marginBottom: 10 }}>New Task</Text>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Enter task title"
              style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
              autoFocus
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Button title="Cancel" onPress={handleCancel} />
              <Button title="Add" onPress={handleAdd} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
