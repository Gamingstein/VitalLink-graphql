import { prisma } from "../lib/db";
import { APIResponse, asyncResolver } from "../utils";

class HospitalService {
  public static async getAllHospitals() {
    return prisma.hospital.findMany({
      include: {
        user: true,
      },
    });
  }
  public static async getHospitalById(id: string) {
    return prisma.hospital.findUnique({
      where: {
        id,
      },
      include: {
        doctors: true,
        user: true,
        patients: true,
        sensors: true,
      },
    });
  }
  public static async getHospitalPatients(id: string) {
    return prisma.patient.findMany({
      where: {
        hospitalID: id,
      },
    });
  }
  public static async getHospitalDoctors(id: string) {
    return prisma.doctor.findMany({
      where: {
        hospitalIDs: {
          has: id,
        },
      },
    });
  }
  public static async getHospitalSensors(id: string) {
    return prisma.sensor.findMany({
      where: {
        hospitalID: id,
      },
    });
  }
  public static createPatient = asyncResolver(async (req, res) => {
    const { name, gender, age, aadhaar, hospitalID, sensorID } =
      req.body as any;
    const patient = await prisma.patient.create({
      data: {
        name,
        age,
        gender,
        aadhaar,
        hospitalID,
        sensorID,
        admitted: true,
      },
    });
    return res
      .status(201)
      .json(new APIResponse(201, "Patient created", patient));
  });
  public static dischargePatient = asyncResolver(async (req, res) => {
    const { patientID } = req.body as any;
    const patient = await prisma.patient.update({
      where: {
        id: patientID,
      },
      data: {
        admitted: false,
        sensor: {
          disconnect: true,
        },
      },
    });
    return res
      .status(201)
      .json(new APIResponse(201, "Patient discharged", patient));
  });
  public static addDoctor = asyncResolver(async (req, res) => {
    const { doctorID, hospitalID } = req.body as any;
    const doctor = await prisma.doctor.update({
      where: {
        id: doctorID,
      },
      data: {
        hospitals: {
          connect: {
            id: hospitalID,
          },
        },
      },
    });
    return res
      .status(201)
      .json(new APIResponse(201, "Doctor added to hospital", doctor));
  });
  public static assignDoctor = asyncResolver(async (req, res) => {
    const { doctorID, patientID } = req.body as any;
    const patient = await prisma.patient.update({
      where: {
        id: patientID,
      },
      data: {
        doctors: {
          connect: {
            id: doctorID,
          },
        },
      },
    });
    return res
      .status(201)
      .json(new APIResponse(201, "Doctor assigned to patient", patient));
  });
  public static removeDoctor = asyncResolver(async (req, res) => {
    const { doctorID, hospitalID } = req.body as any;
    const doctor = await prisma.doctor.update({
      where: {
        id: doctorID,
      },
      data: {
        hospitals: {
          disconnect: {
            id: hospitalID,
          },
        },
      },
    });
    return res.status(201).json(new APIResponse(201, "Doctor removed", doctor));
  });
  public static createSensor = asyncResolver(async (req, res) => {
    const { hospitalID } = req.body as any;
    const sensor = await prisma.sensor.create({
      data: {
        hospitalID,
      },
    });
    return res
      .status(201)
      .json(new APIResponse(201, "Sensor added to hospital", sensor));
  });
  public static assignSensor = asyncResolver(async (req, res) => {
    const { sensorID, patientID } = req.body as any;
    const patient = await prisma.patient.update({
      where: {
        id: patientID,
      },
      data: {
        sensor: {
          connect: {
            id: sensorID,
          },
        },
      },
    });
    return res
      .status(201)
      .json(new APIResponse(201, "Sensor assigned to patient", patient));
  });
}
export default HospitalService;
