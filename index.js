import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello World");
});

// const MONGO_URL = "mongodb://localhost:27017";
const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("I got the Database, Boss.");
  return client;
}

const client = await createConnection();

app.post("/names", async function (req, res) {
  const data = req.body;
  console.log(data);
  const result = await client.db("crud").collection("data").insertMany(data);
  res.send(result);
});

app.get("/names/:id", async function (req, res) {
  console.log(req.params);
  const { id } = req.params;
  const result = await client.db("crud").collection("data").findOne({ id: id });
  result ? res.send(result) : res.status(404).send("match not found");
});

app.get("/names", async function (req, res) {
  console.log(req.query);
  const result = await client
    .db("crud")
    .collection("data")
    .find(req.query)
    .toArray();
  res.send(result);
});

app.delete("/names/:id", async function (req, res) {
  console.log(req.params);
  const { id } = req.params;
  const result = await client.db("crud").collection("data").deleteOne({ id: id });
  result.deletedCount >0 ? res.send(result) : res.status(404).send("match not found");
});

app.put("/names/:id", async function (req, res) {
  console.log(req.params);
  const { id } = req.params;
  const input = req.body;
  const result = await client.db("crud").collection("data").updateOne({id:id},{$set:input});
  result ? res.send(result) : res.status(404).send("match not found");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`app started in ${PORT}`);
});
