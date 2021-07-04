import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async show(req: Request, res: Response) {
    //pegar id do ponto de coleta
    // const id = req.params.id;
    const { id } = req.params;

    //o first > retorna apenas 1 unico registro
    const point = await knex("points").where("id", id).first();

    if (!point) {
      return res.status(400).json({ message: "Point not found." });
    }

    //listar todos os items que tem relaçao com o ponto de coleta
    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id);

    return res.json({ point, items });
  }

  async index(req: Request, res: Response) {
    //vou ter o request de cidades, uf, items (query params, pois se usa sempre que a gente vai lidar com filtros/paginação, etc)
    //OBS. o request params é usado na rota. O request body a gente só usa pra criação e edição de algo.
    const { city, uf, items } = req.query;

    // console.log(city, uf, items);

    //converter items em array
    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.point_id")
      .whereIn("point_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    return res.json(points);
  }

  async create(req: Request, res: Response) {
    const { name, email, whatsapp, latitude, longitude, city, uf, items } =
      req.body;

    const trx = await knex.transaction();

    const point = {
      image:
        "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
      name,
      email,
      whatsapp,
      latitude, 
      longitude,
      city,
      uf,
    };

    const insertedIds = await trx("points").insert(point);

    //melhorar relacionamento
    const point_id = insertedIds[0];

    //para fazer o relacionamento com a tabela de items
    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    });
    await trx("point_items").insert(pointItems);

    await trx.commit();

    return res.json({
      id: point_id,
      ...point,
    });
  }
}

export default PointsController;
