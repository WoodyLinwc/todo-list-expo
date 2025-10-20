import { useRef } from "react";
import { View } from "react-native";
import { Card, List, Checkbox, useTheme } from "react-native-paper";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated from "react-native-reanimated";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface SwipeableTaskItemProps {
  item: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onLongPress: () => void;
  isActive: boolean;
}

export default function SwipeableTaskItem({
  item,
  onToggle,
  onEdit,
  onDelete,
  onLongPress,
  isActive,
}: SwipeableTaskItemProps) {
  const theme = useTheme();
  const swipeableRef = useRef<SwipeableMethods>(null);

  const renderLeftActions = () => {
    return (
      <View
        style={{
          backgroundColor: theme.colors.primary,
          justifyContent: "center",
          alignItems: "flex-start",
          paddingLeft: 20,
          flex: 1,
          borderRadius: 8,
          marginHorizontal: 8,
          marginVertical: 4,
        }}
      >
        <Reanimated.Text
          style={{
            color: "white",
            fontWeight: "600",
          }}
        >
          ✏️ Edit
        </Reanimated.Text>
      </View>
    );
  };

  const renderRightActions = () => {
    return (
      <View
        style={{
          backgroundColor: theme.colors.primaryContainer,
          justifyContent: "center",
          alignItems: "flex-end",
          paddingRight: 20,
          flex: 1,
          borderRadius: 8,
          marginHorizontal: 8,
          marginVertical: 4,
        }}
      >
        <Reanimated.Text
          style={{
            color: "white",
            fontWeight: "600",
          }}
        >
          💯 Complete
        </Reanimated.Text>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => {
        if (direction === "right") {
          // Swipe left to right = edit
          onEdit(item);
        } else if (direction === "left") {
          // Swipe right to left = delete
          onDelete(item.id);
        }
        // Close the swipeable after action
        setTimeout(() => swipeableRef.current?.close(), 100);
      }}
      overshootLeft={false}
      overshootRight={false}
    >
      <Card
        style={{
          marginHorizontal: 8,
          marginVertical: 4,
          opacity: isActive ? 0.8 : 1,
          elevation: isActive ? 8 : 2,
        }}
        onLongPress={onLongPress}
      >
        <List.Item
          title={item.title}
          titleNumberOfLines={3}
          titleStyle={{
            textDecorationLine: item.completed ? "line-through" : "none",
            color: item.completed
              ? theme.colors.secondary
              : theme.colors.onSurface,
          }}
        />
      </Card>
    </Swipeable>
  );
}
