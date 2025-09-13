import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function fetchMaintenanceData(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const db = await connectToDatabase();
    const maintenanceLogs = db.collection("MaintenanceLogs");

    const { assetNumber } = req.query; // expect assetNumber as query param
    const filter: any = {};

    if (assetNumber) {
      filter.AssetNumber = assetNumber;
    }

    const results = await maintenanceLogs
      .aggregate([
        { $match: filter }, // filter by AssetNumber if provided
        {
          $lookup: {
            from: "Inventory",
            localField: "AssetNumber",
            foreignField: "AssetNumber",
            as: "inventoryDetails",
          },
        },
        { $unwind: { path: "$inventoryDetails", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            AssetNumber: 1,
            MaintenanceDate: 1,
            Remarks: 1,
            ScheduledDate: 1,
            PerformedBy: 1,
            MaintenanceReferenceNumber: 1,
            Status: 1,
            Brand: "$inventoryDetails.Brand",
            AssetType: "$inventoryDetails.AssetType",
            Model: "$inventoryDetails.Model",
            Processor: "$inventoryDetails.Processor",
            Ram: "$inventoryDetails.Ram",
            Storage: "$inventoryDetails.Storage",
            SerialNumber: "$inventoryDetails.SerialNumber",
            PurchaseDate: "$inventoryDetails.PurchaseDate",
            AssetAge: "$inventoryDetails.AssetAge",
            Amount: "$inventoryDetails.Amount",
          },
        },
      ])
      .toArray();

    res.status(200).json({ data: results });
  } catch (error) {
    console.error("Error fetching maintenance data:", error);
    res.status(500).json({ error: "Failed to fetch maintenance data" });
  }
}
