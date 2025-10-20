import { useState } from "react";
import { FAB, Portal, Dialog, TextInput, Button } from "react-native-paper";

interface Props {
  onAddTask: (title: string) => void;
}

export default function FloatingAddButton({ onAddTask }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleOpen = () => {
    setInputText("");
    setModalVisible(true);
  };

  const handleCancel = () => {
    setInputText("");
    setModalVisible(false);
  };

  const handleAdd = () => {
    if (inputText.trim()) {
      onAddTask(inputText.trim());
      setInputText("");
      setModalVisible(false);
    }
  };

  return (
    <>
      <FAB
        icon="plus"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={handleOpen}
      />

      <Portal>
        <Dialog visible={modalVisible} onDismiss={handleCancel}>
          <Dialog.Title>New Task</Dialog.Title>
          <Dialog.Content>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Enter a task"
              mode="outlined"
              autoFocus
              onSubmitEditing={handleAdd}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCancel}>Cancel</Button>
            <Button onPress={handleAdd}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
