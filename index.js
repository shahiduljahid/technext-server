const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");
const nodemailer = require("nodemailer");

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
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const sqlInsert = `insert into employees(firstName,lastName,email) values('${firstName}','${lastName}','${email}')`;

  db.query(sqlInsert, (err, result) => {
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

app.post("/send_mail", async (req, res) => {
  const subject = req.body.subject;
  const mailBody = req.body.mailBody;
  const email = req.body.email;
  console.log(subject);
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",   //use your mailtrap host here
    port: 2525,                 //use your mailtrap port here
    auth: {
      user: "c417ad3c70952c",   //use your mailtrap user here
      pass: "3a118c8e58d4ea",   //use your mailtrap pass here
    },
  });
  await transport.sendMail({
    from: "veempower@gmail.com",
    to: "f87a5513b3-08d120@inbox.mailtrap.io",  //use your mailtrap emailAddress here
    subject: `${subject}`,
    html: `<div className="email"style="
            border: 1px solid black;  
            padding:20px;
            font-family:sans-serif;
            line-height:2;
            font-size:20px;
    
            ">
          <p>hey buddy, </p>
          <p>${mailBody}</p>
          <p> All the best , TechNext</p>
            
          </div>`,
  });
});

app.listen(port);
