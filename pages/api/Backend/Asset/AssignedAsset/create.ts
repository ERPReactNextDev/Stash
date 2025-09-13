import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function createAssignedAsset(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const db = await connectToDatabase();
    const assignedCollection = db.collection("AssignedAsset");
    const inventoryCollection = db.collection("Inventory");

    const {
      ReferenceID,
      profilePicture,
      Firstname,
      Lastname,
      Position,
      Department,
      Location,
      Status,
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

    if (!SerialNumber) {
      return res.status(400).json({ error: "SerialNumber is required" });
    }

    // ✅ Check for duplicate serial number in Inventory
    const existingAsset = await inventoryCollection.findOne({
      SerialNumber: SerialNumber.trim(),
    });

    if (existingAsset) {
      return res.status(400).json({
        error: `Asset with Serial Number "${SerialNumber}" already exists in Inventory`,
      });
    }

    // Assigned Asset Data
    const newAssignedAsset = {
      ReferenceID: ReferenceID || "",
      profilePicture: profilePicture || "",
      Firstname: Firstname || "",
      Lastname: Lastname || "",
      Position: Position || "",
      Department: Department || "",
      Location: Location || "",
      Status: Status || "Active",
      Brand: Brand || "",
      AssetType: AssetType || "",
      Model: Model || "",
      Processor: Processor || "",
      Ram: Ram || "",
      Storage: Storage || "",
      SerialNumber: SerialNumber.trim(),
      PurchaseDate: PurchaseDate ? new Date(PurchaseDate) : null,
      AssetAge: AssetAge ? Number(AssetAge) : null,
      Amount: Amount ? Number(Amount) : null,
      Remarks: Remarks || "",
      createdBy: createdBy || "Stash",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert to AssignedAsset
    const { insertedId } = await assignedCollection.insertOne(newAssignedAsset);

    // Generate AssetNumber for Inventory
    const AssetNumber = `${Brand || "UNK"}-${Model || "GEN"}-${SerialNumber}`.replace(
      /\s+/g,
      "_"
    ).toUpperCase();

    // Inventory Data
    const newInventory = {
      AssetNumber,
      Brand: Brand || "",
      AssetType: AssetType || "",
      Model: Model || "",
      Processor: Processor || "",
      Ram: Ram || "",
      Storage: Storage || "",
      SerialNumber: SerialNumber.trim(),
      PurchaseDate: PurchaseDate ? new Date(PurchaseDate) : null,
      AssetAge: AssetAge ? Number(AssetAge) : null,
      Amount: Amount ? Number(Amount) : null,
      Remarks: Remarks || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert to Inventory
    await inventoryCollection.insertOne(newInventory);

    res.status(201).json({
      message: "Asset assigned and added to inventory successfully",
      id: insertedId,
      assetNumber: AssetNumber,
    });
  } catch (error) {
    console.error("❌ Create asset error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
