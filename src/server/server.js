const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const { query } = require("express");

// port 番号
const PORT = 3001;

// db の接続情報
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "sample",
});

// db 接続
connection.connect(function (err) {
  if (err) throw err;
  console.log("You are now connected with mysql database...");
});

// SQL の実行
function executeQuery(sql) {
  connection
    .query(sql)
    .on("error", function (err) {
      console.log("err is: ", err);
    })
    .on("result", function (rows) {
      console.log("The res is: ", rows);
    })
    .on("end", function () {
      console.log("end");
      connection.destroy();
    });
}

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Custom-Header"
  );
  bodyParser.urlencoded({
    extended: true,
  });
  next();
});
app.use(bodyParser.json());

app.get("/test", (req, res) => {
  if (req.query.confidence === null) {
    const sql =
      "insert into ai_analysis_log(image_path, success, message, class, confidence, request_timestamp, response_timestamp) values(" +
      `'${req.query.image_path}'` +
      "," +
      `'${req.query.success}'` +
      "," +
      `'${req.query.message}'` +
      ", null, null, null, null)";

    executeQuery(sql);
  } else {
    const sql =
      "insert into ai_analysis_log(image_path, success, message, class, confidence, request_timestamp, response_timestamp) values(" +
      `'${req.query.image_path}'` +
      "," +
      `'${req.query.success}'` +
      "," +
      `'${req.query.message}'` +
      "," +
      `'${req.query.class}'` +
      "," +
      `'${req.query.confidence}'` +
      "," +
      "null, null)";

    executeQuery(sql);
  }
});

// サーバ起動
app.listen(PORT, () => console.log("Listening on port 3001"));
