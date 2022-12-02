const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3005;

const db = new sqlite3.Database("data/event-app-db.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the event-app SQlite database.");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("etag", false);
app.use(cors());

app.post("/users", (req, res) => {
  const sqlQuery = "SELECT * FROM users WHERE username = ? AND password = ?";
  const { username, password } = req.body;
  console.log(req.body);

  db.all(sqlQuery, [username, password], (err, rows) => {
    if (err) {
      return;
    } else if (rows.length > 0) {
      res.send({ username: username });
    } else {
      res.status(401);
      res.json("Incorrect username or password");
    }
  });
});

app.get("/attendees", (req, res) => {
  const sqlQuery = "SELECT * FROM user1_attendees";

  db.all(sqlQuery, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.status(200);
    res.send(rows);
  });
});

app.post("/attendees", (req, res) => {
  const sqlQuery =
    "INSERT INTO attendees (id, firstName, lastName, age, email) VALUES (?,?,?,?,?)";
  const { id, firstName, lastName, age, email } = req.body;

  db.run(sqlQuery, [id, firstName, lastName, age, email], (err) => {
    if (err) {
      throw err;
    }
    res.send(req.body);
  });
});

app.delete("/attendees/:id", (req, res) => {
  const sqlQuery = "DELETE FROM attendees WHERE id = (?)";
  const { id } = req.params;

  db.run(sqlQuery, [id], (err) => {
    if (err) {
      throw err;
    }
    res.send(req.body);
  });
});

app.put("/attendees/:id", (req, res) => {
  const sqlQuery =
    "UPDATE attendees SET firstName = (?), lastName = (?), age = (?), email = (?) WHERE id = (?);";
  const { id, firstName, lastName, age, email } = req.body;

  db.run(sqlQuery, [firstName, lastName, age, email, id], (err) => {
    if (err) {
      throw err;
    }
    res.send(req.body);
  });
});

app.listen(port, () => {
  console.log(`App listening on port - ${port}`);
});
