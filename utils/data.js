import { Client } from "@elastic/elasticsearch";
import payload from "../models/esconfig.js";
import getDataFromAPI from "./crawler.js";
import genresObj from "../helpers/genresIds.js";

const es = new Client({
  node: "http://localhost:9200",
});

const insertData = async () => {
  try {
    await es.indices.create(payload, {
      ignore: [400],
      headers: {
        "Content-Type": "application/json",
      },
    });
    for (let i = 1; i <= 500; i++) {
      const { results } = await getDataFromAPI(i);
      const dataset = results.map((ele) => {
        const {
          genre_ids,
          id,
          original_language,
          overview,
          popularity,
          release_date,
          title,
          vote_average,
          vote_count,
        } = ele;
        const genres = genre_ids.map((ele) => genresObj[ele]);
        const resData = {
          id,
          title,
          genres,
          original_language,
          overview,
          popularity,
          release_date,
          vote_average,
          vote_count,
        };
        return resData;
      });
      const operations = dataset.flatMap((doc) => [
        { index: { _index: "movies" } },
        doc,
      ]);
      const bulkResponse = await es.bulk({
        refresh: true,
        operations,
      });

      if (bulkResponse.errors) {
        const erroredDocuments = [];
        bulkResponse.items.forEach((action, i) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            erroredDocuments.push({
              status: action[operation].status,
              error: action[operation].error,
              operation: operations[i * 2],
              document: operations[i * 2 + 1],
            });
          }
        });
        console.log(erroredDocuments);
      }

      const count = await es.count({ index: "movies" });
      console.log(count);
    }
  } catch (err) {
    console.error(err);
  }
};

insertData();
