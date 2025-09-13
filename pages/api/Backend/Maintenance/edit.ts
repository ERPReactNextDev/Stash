import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection("MaintenanceLogs");
    const { id } = req.query;

    const updateFields = req.body;
    delete updateFields._id;

    const result = await collection.updateOne(
      { _id: new ObjectId(id as string) },
      { $set: { ...updateFields, updatedAt: new Date() } }
    );

    res.status(200).json({ message: "Post updated", result });
  } catch (error) {
    console.error("Edit error:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
}
