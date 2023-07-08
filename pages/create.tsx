import React from "react";
import TodoForm from "@/components/TodoForm";

const Create = () => {
  const handleSubmit = async (
    title: string,
    dueDate: Date,
    description: string
  ) => {
    const response = await fetch("/api/todos/create", {
      method: "POST",
      body: JSON.stringify({
        title,
        due_date: dueDate,
        description,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const dataResponse = await response.json();
  };

  return (
    <TodoForm
      submitAction={handleSubmit}
      shouldClearAfterSubmit={true}
      defaultTodo={null}
    />
  );
};

export default Create;
