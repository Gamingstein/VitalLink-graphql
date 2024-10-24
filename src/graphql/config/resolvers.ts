import { services } from "../../services";

const queries = {
  users: async () => {
    return await services.user.getAllUsers();
  },
  user: async (_: any, args: any) => {
    return await services.user.getUserById(args);
  },
  doctors: async () => {
    return await services.doctor.getAllDoctors();
  },
  doctor: async (_: any, args: any) => {
    return await services.doctor.getDoctorById(args);
  },
  hospitals: async () => {
    return await services.hospital.getAllHospitals();
  },
  hospital: async (_: any, args: any) => {
    return await services.hospital.getHospitalById(args);
  },
  patients: async () => {
    return await services.patient.getAllPatients();
  },
  patient: async (_: any, args: any) => {
    return await services.patient.getPatientById(args);
  },
  sensorsbyhospital: async (_: any, args: any) => {
    return await services.hospital.getHospitalSensors(args);
  },
  patientsbyhospital: async (_: any, args: any) => {
    return await services.hospital.getHospitalPatients(args);
  },
  doctorsbyhospital: async (_: any, args: any) => {
    return await services.hospital.getHospitalDoctors(args);
  },
  patientsbydoctor: async (_: any, args: any) => {
    return await services.doctor.getDoctorPatients(args);
  },
  hospitalsbydoctor: async (_: any, args: any) => {
    return await services.doctor.getDoctorHospitals(args);
  },
};

const nestedQueries = {
  User: {},
  Doctor: {},
  Hospital: {},
  Patient: {},
};

export const resolvers = { queries, nestedQueries };
