"use strict";

import { Router } from "express";
import CatsController from "./Cat.controller.js";

const router = Router();

router.get("/fromSource", CatsController.load);
router.get("/", CatsController.findAll);
router.get("/:id", CatsController.show);
router.delete("/:id", CatsController.delete);
router.post("/", CatsController.store);
router.put("/:id", CatsController.update);
router.patch("/:id", CatsController.update);

export default router;
