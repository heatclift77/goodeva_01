import { useState } from "react";
import "./App.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Button } from "./components/ui/button";
import { Switch } from "./components/ui/switch";
import { Dialog, DialogContent, DialogTitle } from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Textarea } from "./components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "./components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
const API_URL = import.meta.env.VITE_API_URL

function App() {
  // state
  const [isDialogForm, setIsDialogForm] = useState(false);
  const [search, setSearch] = useState("");

  const form = useForm({
    defaultValues: {
      title: "",
      desc: "",
    },
  });

  // handler
  const onSubmit = (data) => {
    createTodoMutation.mutate(data);
  };

  async function createTodo(payload) {
    const res = await fetch(`${API_URL}/api/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Failed to create todo");
    }

    return res.json;
  }

  async function updateTodo(payload) {
    const res = await fetch(`${API_URL}/api/todo/${payload.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: payload.completed }),
    });

    if (!res.ok) {
      throw new Error("Failed to create todo");
    }

    return res.json;
  }

  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      refetch();
      setIsDialogForm(false);
      form.reset();
    },
    onError: () => {},
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      refetch();
      setIsDialogForm(false);
    },
    onError: () => {
        alert("Server Error")
    },
  });

  const {
    data: todos,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const data = await fetch(
        `${API_URL}/api/todo?search=${search}`
      );
      return data.json();
    },
    enabled: true,
    initialData: [],
    retry: 1
  });

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <Dialog open={isDialogForm}>
          <DialogContent
            className="sm:max-w-[425px]"
            showCloseButton={false}
            aria-description="dialog-form"
            aria-describedby="system"
          >
            <DialogTitle>Add Todo</DialogTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="your title" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-5">
                  <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="your description"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {createTodoMutation.isError && (
                  <div className="mb-5">
                    <Alert variant="destructive">
                      <AlertTitle>Server Error</AlertTitle>
                    </Alert>
                  </div>
                )}
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsDialogForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {createTodoMutation.isPending ? "...loading" : "Submit"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Input
              placeholder="search by title"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <Button onClick={() => refetch()}>Search</Button>
          </div>
          <Button onClick={() => setIsDialogForm(true)} className="mb-5">
            Add Todo
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">is Complete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isError &&
              todos.map((todo) => (
                <TableRow key={todo.id}>
                  <TableCell className="font-medium">{todo.id}</TableCell>
                  <TableCell>{todo.title}</TableCell>
                  <TableCell>{todo.desc}</TableCell>
                  <TableCell align="right">
                    <Switch
                      checked={todo.completed}
                      onClick={() => {
                        updateTodoMutation.mutate({
                          completed: !todo.completed,
                          id: todo.id,
                        });
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            {isError && (
              <TableRow>
                <TableCell className="font-medium" colSpan={4} align="center">
                  Server Error
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default App;
