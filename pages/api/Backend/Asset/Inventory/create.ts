import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

// Helper to generate AssetNumber with 6-digit suffix
const generateAssetNumber = async (db: any, brand?: string, model?: string, serial?: string) => {
  const prefix = `${brand || "UNK"}-${model || "GEN"}-${serial || "000"}`.replace(/\s+/g, "_").toUpperCase();

  // Find last AssetNumber with same prefix
  const lastAsset = await db
    .collection("Inventory")
    .find({ AssetNumber: { $regex: `^${prefix}-\\d{6}$` } })
    .sort({ AssetNumber: -1 })
    .limit(1)
    .toArray();

  let nextNumber = 1;
  if (lastAsset.length > 0) {
    const lastNumStr = lastAsset[0].AssetNumber.split("-").pop();
    if (lastNumStr) nextNumber = parseInt(lastNumStr) + 1;
  }

  // Pad with zeros to 6 digits
  const suffix = nextNumber.toString().padStart(6, "0");

  return `${prefix}-${suffix}`;
};

export default async function createProduct(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection("Inventory");

    const {
      Brand,
      AssetType,
      Model,
      Processor,
      Ram,
      Storage,
      SerialNumber,
      PurchaseDate,
      AssetAge,
      Amount,
      Remarks,
      createdBy,
    } = req.body;

    // Validate required fields
    if (!Brand || !Model || !SerialNumber) {
      return res.status(400).json({ error: "Missing required fields: Brand, Model or SerialNumber." });
    }

    // Generate AssetNumber with 6-digit suffix
    const AssetNumber = await generateAssetNumber(db, Brand, Model, SerialNumber);

    const newProduct = {
      AssetNumber,
      Brand,
      AssetType: AssetType || "",
      Model,
      Processor: Processor || "",
      Ram: Ram || "",
      Storage: Storage || "",
      SerialNumber,
      PurchaseDate: PurchaseDate ? new Date(PurchaseDate) : null,
      AssetAge: AssetAge || "",
      Amount: Amount || 0,
      Remarks: Remarks || "",
      createdBy: createdBy || "Unknown",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { insertedId } = await collection.insertOne(newProduct);

    res.status(201).json({ message: "Product created successfully", id: insertedId, AssetNumber });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
