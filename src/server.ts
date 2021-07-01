import express from "express";
import routes from "./routes";

// para resolver os 3 pontinhos da importação
//falta a definição de tipos > npm i --save-dev @types/express

const app = express();

app.use(express.json());
app.use(routes);

// const users = ["Everton", "Cleiton", "Jeremias"];

// app.get("/users/:id", (req, res) => {
//   //Quando busco esse id da minha requisição, ele vem em string.
//   //Numero em formato de string nao pode ser representado para representar um numero
//   //tenho que converter em Number
//   const id = Number(req.params.id);

//   const user = users[id];

//   return res.json(user);
// });

// app.post("/users", (req, res) => {
//   const data = req.body;

//   console.log(data);

//   const user = {
//     name: data.name,
//     email: data.email,
//   };

//   return res.json(user);
// });

app.listen(3333);
