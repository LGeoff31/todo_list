import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { TodoType } from "@/pages";

const TodoForm: React.FunctionComponent<{
  submitAction: (
    title: string,
    dueDate: Date,
    description: string
  ) => Promise<void>;
  shouldClearAfterSubmit: boolean;
  defaultTodo: TodoType | null;
}> = ({ submitAction, shouldClearAfterSubmit, defaultTodo }) => {
  const [title, setTitle] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [description, setDescription] = useState<string>("");
  const [processingSubmit, setProcessingSubmit] = useState(false);

  useEffect(() => {
    if (defaultTodo !== null) {
      setTitle(defaultTodo.title);
      setDueDate(new Date(defaultTodo.due_date));
      setDescription(defaultTodo.description);
    }
  }, []);

  const innerHandleSubmit = async () => {
    // Perform validation first.

    if (dueDate === null) {
      console.log("BAD");
      return;
    }

    setProcessingSubmit(true);
    await submitAction(title, dueDate, description);
    if (shouldClearAfterSubmit) {
      setTitle("");
      setDueDate(null);
      setDescription("");
    }
    setProcessingSubmit(false);
  };

  return (
    <form>
      <Navbar />
      <Stack direction="column" spacing={1} alignItems={"center"}>
        <TextField
          variant="outlined"
          label="title"
          value={title}
          sx={{ width: "500px" }}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="date"
          type="date"
          value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
          onChange={(e) => setDueDate(new Date(e.target.value))}
        />
        <TextField
          variant="outlined"
          label="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ width: "80vw" }}
        />
        <LoadingButton
          variant="contained"
          onClick={innerHandleSubmit}
          loading={processingSubmit}
          // isLoading={processingEdit}
          //   endIcon={<AddTaskIcon />}
        >
          Submit
        </LoadingButton>
      </Stack>
    </form>
  );
};

export default TodoForm;
