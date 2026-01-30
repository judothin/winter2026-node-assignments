const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

const MONGO_URI = "mongodb+srv://jaydenfagre_db_user:OLive2002@assignment2.r1maoct.mongodb.net/todo_app?retryWrites=true&w=majority&appName=ASSIGNMENT2";

const DB_NAME = "todo_app";
const COLLECTION_NAME = "todos";

let todosCollection;

// serve static files in /public
app.use(express.static(path.join(__dirname, "public")));

// main route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/todo", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "todo.html"));
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await todosCollection.find({}).toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(todos));
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// redirect
app.use((req, res) => {
  res.redirect("/index.html");
});

async function start() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);
    todosCollection = db.collection(COLLECTION_NAME);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("err);
  }
}

start();