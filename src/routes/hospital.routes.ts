import { Router } from "express";
import { services } from "../services";

const router = Router();

router.all("/", (_, res) => res.send("Hospital route"));
router.post("/create-patient", services.hospital.createPatient);
router.post("/discharge-patient", services.hospital.dischargePatient);
router.post("/remove-patient", services.hospital.removePatient);
router.post("/add-doc", services.hospital.addDoctor);
router.post("/assign-doc", services.hospital.assignDoctor);
router.post("/remove-doc", services.hospital.removeDoctor);
router.post("/create-sensor", services.hospital.createSensor);
router.post("/assign-sensor", services.hospital.assignSensor);

export default router;
