import { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/MongoDB"; // ✅ gamit helper

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const db = await getDb("ecoshift"); // ✅ ibang database na
    const users = await db.collection("users").find({}).toArray();

    const formattedUsers = users.map((u: any) => ({
      id: u.ReferenceID || u._id.toString(),
      firstname: u.Firstname || "",
      lastname: u.Lastname || "",
      position: u.Position || "",
      department: u.Department || "",
      location: u.Location || "",
      profilePicture: u.profilePicture || "", // ✅ added
    }));

    res.status(200).json({ data: formattedUsers });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}
