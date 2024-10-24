import { prisma } from "../lib/db";
import { APIResponse, asyncResolver } from "../utils";

class DoctorService {
  public static async getAllDoctors() {
    return prisma.doctor.findMany({
      include: {
        user: true,
      },
    });
  }
  public static async getDoctorById(id: string) {
    return prisma.doctor.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        patients: true,
        hospitals: true,
      },
    });
  }
  public static async getDoctorPatients(id: string) {
    return prisma.patient.findMany({
      where: {
        doctorIDs: {
          has: id,
        },
      },
    });
  }
  public static async getDoctorHospitals(id: string) {
    return prisma.hospital.findMany({
      where: {
        doctorIDs: {
          has: id,
        },
      },
    });
  }
  public static addPatient = asyncResolver(async (req, res) => {
    const { doctorID, patientID } = req.body as any;
    const doctor = await prisma.doctor.update({
      where: {
        id: doctorID,
      },
      data: {
        patients: {
          connect: {
            id: patientID,
          },
        },
      },
    });
    return res.status(200).json(new APIResponse(200, "Patient added", doctor));
  });
  public static removePatient = asyncResolver(async (req, res) => {
    const { doctorID, patientID } = req.body as any;
    const doctor = await prisma.doctor.update({
      where: {
        id: doctorID,
      },
      data: {
        patients: {
          disconnect: {
            id: patientID,
          },
        },
      },
    });
    return res
      .status(200)
      .json(new APIResponse(200, "Patient removed", doctor));
  });
}
export default DoctorService;
