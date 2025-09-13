// pages/api/Backend/Asset/Inventory/disposal.ts
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
    const collection = db.collection("Inventory");

    const { ids }: { ids: string[] } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No asset IDs provided" });
    }

    // Convert string IDs to ObjectId
    const objectIds = ids.map((id) => new ObjectId(id));

    const result = await collection.updateMany(
      { _id: { $in: objectIds } },
      { $set: { status: "disposal", updatedAt: new Date() } }
    );

    res.status(200).json({ message: "Assets marked for disposal", modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Disposal update error:", error);
    res.status(500).json({ error: "Failed to update disposal status" });
  }
}
