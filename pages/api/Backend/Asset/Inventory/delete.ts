import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection("Inventory");
    const { id } = req.query;

    const result = await collection.deleteOne({ _id: new ObjectId(id as string) });

    res.status(200).json({ message: "Data deleted", result });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete data" });
  }
}
