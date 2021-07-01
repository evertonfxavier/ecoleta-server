import express from "express";

const routes = express.Router();

routes.post("/", (req, res) => {
  return res.json({ message: "Hello" });
});

export default routes;