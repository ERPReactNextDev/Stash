import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

// Check Mongo URI
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const uri = process.env.MONGODB_URI;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri);
  }

  clientPromise = globalWithMongo._mongoClient.connect();
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

// Connect to DB
export async function connectToDatabase() {
  const client = await clientPromise;
  return client.db("it")
}

// Get specific database (other than "it")
export async function getDb(dbName: string) {
  const client = await clientPromise;
  return client.db(dbName);
}


// Register a new user
export async function registerUser({
  Email,
  Password,
  Role,
  Firstname,
  Lastname,
  ReferenceID,
}: {
  Email: string;
  Password: string;
  Role: string;
  Firstname: string;
  Lastname: string;
  ReferenceID: string;
}) {
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  // Check for existing user
  const existingUser = await usersCollection.findOne({ Email });
  if (existingUser) {
    return { success: false, message: "Email already in use" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(Password, 10);

  // Insert new user
  await usersCollection.insertOne({
    Email,
    Password: hashedPassword,
    Role,
    Firstname,
    Lastname,
    ReferenceID,
    createdAt: new Date(),
  });

  return { success: true };
}

// Validate login credentials
export async function validateUser({
  Email,
  Password,
}: {
  Email: string;
  Password: string;
}) {
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ Email });
  if (!user) {
    return { success: false, message: "Invalid email or password" };
  }

  const isValidPassword = await bcrypt.compare(Password, user.Password);
  if (!isValidPassword) {
    return { success: false, message: "Invalid email or password" };
  }

  return { success: true, user };
}
