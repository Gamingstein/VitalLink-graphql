import { Router } from "express";
import { services } from "../services";

const router = Router();

router.all("/", (_, res) => res.send("Doctor route"));
router.post("/add-patient", services.doctor.addPatient);
router.post("/remove-patient", services.doctor.removePatient);

export default router;
