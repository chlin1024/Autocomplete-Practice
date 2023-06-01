import { Client } from "@elastic/elasticsearch";

const es = new Client({
  node: "http://localhost:9200",
});

export default es;
