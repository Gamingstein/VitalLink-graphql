export const queries = `#graphql
  users: [User]
  user(id: ID!): User
  doctors: [Doctor]
  doctor(id: ID!): Doctor
  hospitals: [Hospital]
  hospital(id: ID!): Hospital
  patients: [Patient]
  patient(id: ID!): Patient
`;
