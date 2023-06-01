import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import searchRoute from "./routes/search.js";

const app = express();

dotenv.config();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static("public"));
app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("index");
});
app.use(searchRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
