import {Request, Response} from "express";
import knex from "../database/connection";

class PointsController {
  async show(request: Request, response: Response) {
    const { id } = request.params;
    const point = await knex("points").where("id", id).first();
    if (!point) {
      return response.status(400).json({ message: "points not found" });
    }
    return response.json(point);
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const point = {
      image: "image-fake",
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };
    const insert_id = await knex("points").insert(point);

    const point_id = insert_id[0];
    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    });
    await knex("point_items").insert(pointItems);
    return response.json({
      id: point_id,
      ...point,
    });
  }
}

export default PointsController;
