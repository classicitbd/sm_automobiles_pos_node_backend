import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllLedger } from "./ledger.controller";
const router = express.Router();

// Create, Get Ledger
router
  .route("/")
  .get(verifyToken("ledger_show"), findAllLedger)

export const LedgerRoutes = router;
