import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

// Helper to generate MaintenanceReferenceNumber
const generateMaintenanceRef = (assetNumber: string, maintenanceDate: string) => {
  // Format date as YYYYMMDD
  const dateStr = new Date(maintenanceDate).toISOString().split("T")[0].replace(/-/g, "");
  // Generate random 6-digit number
  const randomSuffix = Math.floor(100000 + Math.random() * 900000); // 100000–999999
  return `${assetNumber}-${dateStr}-${randomSuffix}`;
};

export default async function createMaintenanceLog(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection("MaintenanceLogs");

    const {
      AssetNumber,
      MaintenanceDate,
      Remarks,
      PerformedBy,
      status,
      ScheduledDate,
    } = req.body;

    // Validate required fields
    if (!AssetNumber || !MaintenanceDate) {
      return res.status(400).json({ error: "Missing required fields: AssetNumber or MaintenanceDate." });
    }

    // Generate MaintenanceReferenceNumber
    const MaintenanceReferenceNumber = generateMaintenanceRef(AssetNumber, MaintenanceDate);

    const newLog = {
      AssetNumber,
      MaintenanceDate: new Date(MaintenanceDate),
      Remarks: Remarks || "",
      PerformedBy: PerformedBy || "",
      ScheduledDate: ScheduledDate ? new Date(ScheduledDate) : null,
      MaintenanceReferenceNumber,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { insertedId } = await collection.insertOne(newLog);

    res.status(201).json({ message: "Maintenance log created successfully", id: insertedId, MaintenanceReferenceNumber });
  } catch (error) {
    console.error("Create maintenance log error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
