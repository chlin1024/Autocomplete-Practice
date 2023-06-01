import express from "express";
import { autoComplete, searchMoreInfo } from "../controllers/search.js";

const router = express.Router();

router.post("/autocomplete", autoComplete);

router.post("/searchmore", searchMoreInfo);

export default router;
