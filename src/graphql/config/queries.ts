export const queries = `#graphql
  users: [User]
  user(id: ID!): User
  doctors: [Doctor]
  doctor(id: ID!): Doctor
  hospitals: [Hospital]
  hospital(id: ID!): Hospital
  patients: [Patient]
  patient(id: ID!): Patient
  sensorsbyhospital(id: ID!): [Sensor]
  patientsbyhospital(id: ID!): [Patient]
  doctorsbyhospital(id: ID!): [Doctor]
  patientsbydoctor(id: ID!): [Patient]
  hospitalsbydoctor(id: ID!): [Hospital]
`;
