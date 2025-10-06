import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, CheckCircle2 } from "lucide-react";
import AddTodoForm from "@/components/AddTodoForm";
import TodoList from "@/components/TodoList";
import FilterTabs, { FilterType } from "@/components/FilterTabs";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching todos",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([{ title, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setTodos([data, ...todos]);
      toast({
        title: "Todo added!",
        description: "Your new todo has been created.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding todo",
        description: error.message,
      });
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ completed })
        .eq("id", id);

      if (error) throw error;

      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo)));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating todo",
        description: error.message,
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) throw error;

      setTodos(todos.filter((todo) => todo.id !== id));
      toast({
        title: "Todo deleted",
        description: "Your todo has been removed.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting todo",
        description: error.message,
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="max-w-2xl mx-auto pt-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-soft">
              <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              My Todos
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="transition-all duration-300 hover:shadow-soft"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Card className="shadow-lg border-border/50 backdrop-blur-sm bg-card/95 mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Add New Todo</CardTitle>
          </CardHeader>
          <CardContent>
            <AddTodoForm onAdd={addTodo} />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-border/50 backdrop-blur-sm bg-card/95">
          <CardHeader>
            <FilterTabs currentFilter={filter} onFilterChange={setFilter} counts={counts} />
          </CardHeader>
          <CardContent>
            <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
