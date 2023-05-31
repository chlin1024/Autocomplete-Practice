import express from "express";
import dotenv from "dotenv";
import es from "./models/es.js";
import bodyParser from "body-parser";

const app = express();

dotenv.config();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/autocomplete", async (req, res) => {
  const { q } = req.body;

  const data = await es.search({
    index: "movies",
    body: {
      query: {
        regexp: {
          title: `${q}.*`,
        },
      },
    },
  });
  const resData = data.hits.hits.map((ele) => ele._source.title);
  console.log(resData);
  //   const suggestions = body.suggest.suggestions[0].options.map(
  //     (option) => option.text
  //   );
  //   res.json(suggestions);
});

app.get("/search", function (req, res) {
  es.search(
    {
      index: indexname,
      body: {
        query: {
          multi_match: {
            query: req.query.search,
            fields: ["title", "overview"],
          },
        },
      },
    },
    function (error, response) {
      res.json({ result: response });
    }
  );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
