const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");

const port = 4000;
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234", // use your root password here
  database: "technext",
});
db.query("show tables", (err, results) => {
  if (err) {
    return console.log(err);
  }
  return console.log(results);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("database working");
});

app.post("/addEmployee", (req, res) => {
  console.log(req.body);
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const sqlInsert = `insert into employees(firstName,lastName,email) values('${firstName}','${lastName}','${email}')`;

  db.query(sqlInsert, (err, result) => {
    console.log(result.affectedRows);
    if (result.affectedRows > 0) {
      res.send(result);
    }
  });
});
app.get("/allEmployees", (req, res) => {
  const sqlQuery = `select * from employees`;

  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

app.listen(port);
