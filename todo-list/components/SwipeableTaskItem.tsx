import { useRef } from "react";
import { View } from "react-native";
import { Card, List, useTheme } from "react-native-paper";
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
  onComplete: (id: string) => void;
  onLongPress: () => void;
  isActive: boolean;
}

export default function SwipeableTaskItem({
  item,
  onToggle,
  onEdit,
  onComplete,
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
          width: 100,
          marginVertical: 4,
        }}
      >
        <Reanimated.Text
          style={{
            color: "white",
            fontWeight: "600",
          }}
        >
          Edit
        </Reanimated.Text>
      </View>
    );
  };

  const renderRightActions = () => {
    return (
      <View
        style={{
          backgroundColor: "#4CAF50",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingRight: 20,
          width: 100,
          marginVertical: 4,
        }}
      >
        <Reanimated.Text
          style={{
            color: "white",
            fontWeight: "600",
          }}
        >
          Complete
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
        // Close immediately first
        swipeableRef.current?.close();

        if (direction === "right") {
          // Swipe left to right = edit
          setTimeout(() => {
            onEdit(item);
          }, 50);
        } else if (direction === "left") {
          // Swipe right to left = complete task
          onComplete(item.id);
        }
      }}
      overshootLeft={false}
      overshootRight={false}
      friction={2}
      leftThreshold={80}
      rightThreshold={80}
    >
      <Card
        style={{
          marginHorizontal: 8,
          marginVertical: 4,
          elevation: isActive ? 8 : 2,
          backgroundColor: theme.colors.surface,
          transform: isActive ? [{ scale: 1.02 }] : [{ scale: 1 }],
        }}
        onLongPress={onLongPress}
      >
        <List.Item title={item.title} titleNumberOfLines={3} />
      </Card>
    </Swipeable>
  );
}
