import clientPromise from "@/lib/mobgodb";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

function isValidDate(d: Date) {
  // @ts-ignore
  return d instanceof Date && !isNaN(d);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Running the EDIT API");
  try {
    console.log(req.body);
    if (req.method !== "PATCH") {
      return res
        .status(405)
        .json({ error: "Method not allowed, only PATCH is allowed." });
    }

    // Write the actual logic

    // 1.Update the database for title, date, descritpion for the specific ID box that is clicked

    const data = req.body;
    const id = data.id as string;
    const title = data.title as string;
    const due_date = new Date(data.due_date);
    const description = data.description as string;

    let errorMessage = " ";
    let isValid = true;
    //validation

    // if (is_complete !== false && is_complete !== true) {
    //   return res.status(400).json({ error: "DID NOT PASS ISCOMPLETE" });
    // }
    if (id === undefined) {
      return res.status(400).json({ error: "DID NOT PASS ID" });
    }
    if (title === undefined || title?.trim()?.length === 0) {
      isValid = false;
      errorMessage += " bad title";
    }
    if (description === undefined || description?.trim()?.length === 0) {
      isValid = false;
      console.log("reached");
      errorMessage += " bad description";
    }
    if (due_date === undefined || !isValidDate(due_date)) {
      isValid = false;
      errorMessage += " bad due_date";
    }
    if (!isValid) {
      return res.status(400).json({ error: errorMessage });
    }
    //2. update database for title, date, description

    // 3. Add a new todo with this data into the database (MongoDB).

    const client = await clientPromise;
    const myDB = client.db("Cluster1");
    const myColl = myDB.collection("todo");
    const arrayLists = await myColl.find({}).toArray();
    let isValidId = false;
    for (const todo of arrayLists) {
      console.log(todo._id, id);
      if (todo._id.toString() === id) {
        isValidId = true;
      }
    }
    if (isValidId === false) {
      return res.status(404).json({ error: "Not valid ID in database" });
    }
    let newId = new ObjectId(id);
    const result = await myColl.updateMany(
      { _id: new ObjectId(id) },
      { $set: { title: title, date: due_date, description: description } }
    );
    console.log("Inserted", result);

    // 4. Return the it has been created successfully.
    return res.status(200).json({ status: "success", is: result });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: JSON.stringify(e) });
  }
}
