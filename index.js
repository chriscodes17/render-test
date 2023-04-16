const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use(express.static("build"));

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;
  return maxId + 1;
};

const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---");
  next();
};
app.use(requestLogger);

app.get("/", (req, res) => {
  res.send("Hey BOY!");
});

app.get("/api/notes/:id", (request, response) => {
  const id = +request.params.id;
  const note = notes.find((note) => note.id === id);
  note ? response.json(note) : response.status(404).end();
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const body = req.body;
  if (!body.content) {
    return res.status(400).json({
      error: "content missing",
    });
  }
  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };
  notes = notes.concat(note);
  res.json(note);
});

app.put("/api/notes/:id", (req, res) => {
  const id = +req.params.id;
  const note = notes.find((n) => n.id === id);
  const updateNote = { ...note, important: !note.important };
  notes = notes.map((n) => (n.id !== id ? n : updateNote));
  res.json(updateNote);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = +req.params.id;
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

const unknownEndpoint = (request, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
