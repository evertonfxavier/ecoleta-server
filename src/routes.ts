import express from "express";
import knex from "./database/connection";
import PointsController from "./controllers/PointsController";
import ItemsController from "./controllers/ItemsController";

import multer from "multer";
import multerConfig from "./config/multer";

const routes = express.Router();
const upload = multer(multerConfig);

//criar instancia da classe
const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get("/items", itemsController.index);
//filtro por estado/cidade/items
//index porque quero listar vários
routes.get("/points/", pointsController.index);
//lista ponto de coleta especifico
routes.get("/points/:id", pointsController.show);

routes.post("/points", upload.single('image'), pointsController.create);

export default routes;
