export const typedefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    name: String!
    isAdmin: Boolean!
    avatar: String
    doctor: Doctor
    hospital: Hospital
  }

  type Doctor {
    id: ID!
    user: User
    gender: String!
    specification: String!
    patients: [Patient]
    hospitals: [Hospital]
  }

  type Hospital {
    id: ID!
    user: User
    patients: [Patient]
    doctors: [Doctor]
    sensors: [Sensor]
  }

  type Patient {
    id: ID!
    name: String!
    gender: String!
    aadhaar: String!
    admitted: Boolean!
    age: Int!
    doctors: [Doctor]
    hospital: Hospital
    sensor: Sensor
  }

  type Sensor {
    id: ID!
    hospital: Hospital
    patient: Patient
    macAddress: String!
  }
`;
