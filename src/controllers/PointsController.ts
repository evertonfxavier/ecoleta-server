import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
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

    const serializedPoints = points.map((point) => {
      return {
        ...point,
        // image_url: `http://localhost:3333/uploads/${point.image}`,
        image_url: `http://10.0.0.53:3333/uploads/${point.image}`,
      };
    });

    return res.json(serializedPoints);
  }

  async create(req: Request, res: Response) {
    const { name, email, whatsapp, latitude, longitude, city, uf, items } =
      req.body;

    const trx = await knex.transaction();

    const point = {
      image: req.file?.filename,
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
    const pointItems = items
      .split(",")
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
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

  async show(req: Request, res: Response) {
    //pegar id do ponto de coleta
    // const id = req.params.id;
    const { id } = req.params;

    //o first > retorna apenas 1 unico registro
    const point = await knex("points").where("id", id).first();

    if (!point) {
      return res.status(400).json({ message: "Point not found." });
    }

    const serializedPoint = {
      ...point,
      // image_url: `http://localhost:3333/uploads/${point.image}`,
      image_url: `http://10.0.0.53:3333/uploads/${point.image}`,
    };

    //listar todos os items que tem relaçao com o ponto de coleta
    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id);

    return res.json({ point: serializedPoint, items });
  }
}

export default PointsController;
