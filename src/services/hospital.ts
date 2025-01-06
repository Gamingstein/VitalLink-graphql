import { Gender } from "@prisma/client";
import { prisma } from "../lib/db";
import { APIResponse, asyncResolver } from "../utils";

class HospitalService {
  public static async getAllHospitals() {
    return prisma.hospital.findMany({
      include: {
        doctors: {
          include: {
            user: true,
          },
        },
        user: true,
        patients: true,
        sensors: true,
      },
    });
  }

  public static async getHospitalById({ id }: { id: string }) {
    return prisma.hospital.findUnique({
      where: {
        id,
      },
      include: {
        doctors: {
          include: {
            user: true,
          },
        },
        user: true,
        patients: true,
        sensors: true,
      },
    });
  }

  public static async getHospitalPatients({ id }: { id: string }) {
    return prisma.patient.findMany({
      where: {
        hospitalID: id,
      },
      include: {
        doctors: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  public static async getHospitalDoctors({ id }: { id: string }) {
    return prisma.doctor.findMany({
      where: {
        hospitalIDs: {
          has: id,
        },
      },
      include: {
        user: true,
      },
    });
  }

  public static async getHospitalSensors({ id }: { id: string }) {
    return prisma.sensor.findMany({
      where: {
        hospitalID: id,
        patient: null,
      },
      select: {
        id: true,
        macAddress: true,
      },
    });
  }

  public static createPatient = asyncResolver(async (req, res) => {
    const { name, gender, age, aadhaar, sensorID } = req.body as any;
    const hospitalID = (req as any).user.hospital.id;

    const patient = await prisma.patient.upsert({
      where: {
        aadhaar: parseInt(aadhaar),
        admitted: false,
      },
      update: {
        admitted: true,
        sensor: {
          connect: {
            id: sensorID,
          },
        },
      },
      create: {
        name,
        age,
        gender: gender.toUpperCase() as Gender,
        aadhaar: parseInt(aadhaar),
        admitted: true,
        hospital: {
          connect: {
            id: hospitalID,
          },
        },
        sensor: {
          connect: {
            id: sensorID,
          },
        },
      },
    });

    if (patient) {
      return res
        .status(201)
        .json(new APIResponse(201, "Patient created", patient));
    } else {
      return res
        .status(400)
        .json(
          new APIResponse(400, "Patient already created and admitted", patient),
        );
    }
  });

  public static dischargePatient = asyncResolver(async (req, res) => {
    const { patientID } = req.body as { patientID: string };
    const patient = await prisma.patient.update({
      where: {
        id: patientID,
      },
      data: {
        admitted: false,
      },
    });
    return res
      .status(201)
      .json(new APIResponse(201, "Patient discharged", patient));
  });

  public static removePatient = asyncResolver(async (req, res) => {
    const { patientID } = req.body as { patientID: string };
    const patient = await prisma.patient.delete({
      where: {
        id: patientID,
      },
    });
    return res
      .status(201)
      .json(new APIResponse(201, "Patient removed", patient));
  });

  public static addDoctor = asyncResolver(async (req, res) => {
    const { doctorID } = req.body as any;
    const hospitalID = (req as any).user.hospital.id;
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
    const { doctorID } = req.body as any;
    const hospitalID = (req as any).user.hospital.id;
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
    const { macAddress } = req.body as any;
    const hospitalID = (req as any).user.hospital.id;
    const sensor = await prisma.sensor.create({
      data: {
        hospitalID,
        macAddress,
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
