const { time, timeStamp } = require("console");
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000
const fs = require("fs");

// serve static files in public
app.use(express.static(path.join(__dirname, "public")));

// main route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/todo", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "todo.html"));
});

// redirect 
app.use((request, response) => {
  response.writeHead(301, {'Location': "http://" + request.headers['host'] + '/index.html' });
  response.end();
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});