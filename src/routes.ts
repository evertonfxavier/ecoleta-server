import express from "express";
import knex from "./database/connection";
import PointsController from "./controllers/PointsController";
import ItemsController from "./controllers/ItemsController";

const routes = express.Router();

//criar instancia da classe
const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get("/items", itemsController.index);

routes.post("/points", pointsController.create);

//lista ponto de coleta especifico
routes.get("/points/:id", pointsController.show);

//filtro por estado/cidade/items
//index porque quero listar vários
routes.get("/points/", pointsController.index);

export default routes;
