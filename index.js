// to import the express using the import module add module to the package.json
import express from "express";
import { MongoClient } from "mongodb";

// calling the express function to use the methods in it
const app = express();
app.use(express.json()) //inbuilt middleware

// the data is not json still node js will do the work for us
// const data = [
//   {
//     id: 1,
//     name: "gana",
//   },
//   {
//     id: 2,
//     name: "ishu",
//   },
//   {
//     id: 3,
//     name: "anjali",
//   },
// ];

const MONGO_URL = process.env.MONGO_URI;
// hvHqysPyr0j62CDG
app.use(express.json());
async function createconnection(){
const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("mongodb connected");
return client;
}

const client = await createconnection();

app.get("/", function (req, res) {
  res.send("hello world");
});

// app.get("/data", function (req, res) {
  
//   res.send(data);
// });

app.get("/data/:id",async function (req, res) {
  console.log(req.params);
  const { id } = req.params;
  // this below line displays the data in an array
  // const single_data = data.filter((sd)=>sd.id==id)
  // this below line with the first index looks hacky
  // const single_data = data.filter((sd)=>sd.id==id)[0]
  // so we use another method similar to filter which is find, find only return an element whereas
  //  filter returns an array
  // const single_data = data.find((sd) => sd.id == id);
  const single_data = await client.db("crud").collection("data").findOne({id:id});
  single_data ?  res.send(single_data) : res.status(404).send({msg:"data not found"});
});


// this alone can't take the data in, node need the info og how the data is sent
// so middleware mention json is necessary
app.post("/input",async function (res,req){
 const input = req.body
 const input_data = await client.db("crud").collection("data").insertMany(input);
  res.send(input_data);
})



const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app started in ${port}`);
});
