import { TodoType } from "@/pages";
import React, { useState } from "react";
import {
  Link,
  Card,
  Box,
  Button,
  Stack,
  Typography,
  Grid,
} from "@mui/material";
import { format } from "date-fns";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const TodoCard: React.FunctionComponent<{
  fetchData: () => void;
  todo: TodoType;
}> = ({ fetchData, todo }) => {
  const id = todo._id;
  const handleChange = async () => {
    const response = await fetch("/api/todos/update", {
      method: "PATCH",
      body: JSON.stringify({
        id: todo._id,
        is_complete: !todo.is_complete,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const dataResponse = await response.json();
    fetchData();
  };
  const handleDelete = async () => {
    const response = await fetch(`/api/todos/delete/${todo._id}`, {
      method: "DELETE",
    });
    const dataResponse = await response.json();
    console.log(dataResponse);
    fetchData();
  };
  const stringToColor = (str: string): string => {
    let result = 0;
    for (let letter of str) {
      result += letter.charCodeAt(0);
    }
    const n1 = result * 17;
    const n2 = result * 23;
    const n3 = result * 27;

    return `rgb(${(n1 % 150) + 104}, ${(n2 % 150) + 104}, ${(n3 % 150) + 104})`;
  };
  return (
    <Card
      variant="outlined"
      //   bgcolor={stringToColor(todo.title)}
    >
      <CardContent>
        <Stack direction="row">
          <Typography fontWeight="bold">Completed:</Typography>
          <input
            type="checkbox"
            checked={todo.is_complete}
            onChange={handleChange}
          />
        </Stack>
        <Typography>Task: {todo.title}</Typography>
        <Typography>
          Due:{" "}
          {todo.due_date
            ? format(new Date(todo.due_date), "MMMM, do, yyyy")
            : "NO DATE"}
        </Typography>
        <Typography>Description: {todo.description}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="outlined" onClick={handleDelete}>
          Delete {<DeleteIcon />}
        </Button>
        <Link href={`/edit/${id}`}>
          <Button variant="outlined">Edit {<EditIcon />}</Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default TodoCard;
