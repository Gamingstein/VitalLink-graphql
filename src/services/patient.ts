import { prisma } from "../lib/db";

class PatientService {
  public static async getAllPatients() {
    return prisma.patient.findMany();
  }
  public static async getPatientById({ id }: { id: string }) {
    return prisma.patient.findUnique({
      where: {
        id,
      },
      include: {
        hospital: {
          include: {
            user: true,
          },
        },
        doctors: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
export default PatientService;
