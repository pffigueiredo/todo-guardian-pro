import { useState } from "react";
import { Trash2, Circle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const TodoList = ({ todos, onToggle, onDelete }: TodoListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <Circle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
        <p className="text-muted-foreground">No todos yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={cn(
            "group flex items-center gap-3 p-4 rounded-lg border bg-card",
            "transition-all duration-300 hover:shadow-soft",
            deletingId === todo.id && "opacity-50 scale-95"
          )}
        >
          <button
            onClick={() => onToggle(todo.id, !todo.completed)}
            className="flex-shrink-0 transition-all duration-300 hover:scale-110"
          >
            {todo.completed ? (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
            )}
          </button>
          <span
            className={cn(
              "flex-1 transition-all duration-300",
              todo.completed && "line-through text-muted-foreground"
            )}
          >
            {todo.title}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(todo.id)}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
