import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { TodoType } from "..";
import TodoForm from "@/components/TodoForm";

const Edit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [todo, setTodo] = useState<TodoType | null>(null);

  const fetchData = async () => {
    const response = await fetch("/api/todos/list", { method: "GET" });
    const allTodos: TodoType[] = (await response.json()).todos;
    console.log("allTodos", allTodos);
    const currentTodo = allTodos.find((t) => t._id === id);
    if (currentTodo !== undefined) {
      setTodo(currentTodo);
    }
  };

  useEffect(() => {
    if (id === undefined) {
      return;
    }
    fetchData();
  }, [id]);

  const handleEdit = async (
    title: string,
    dueDate: Date,
    description: string
  ) => {
    const response = await fetch("/api/todos/edit", {
      method: "PATCH",
      body: JSON.stringify({
        id: id,
        title: title,
        due_date: dueDate,
        description: description,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const dataResponse = await response.json();
    router.push("/");
  };

  return (
    <TodoForm
      submitAction={handleEdit}
      shouldClearAfterSubmit={false}
      defaultTodo={todo}
    />
  );
};

export default Edit;
