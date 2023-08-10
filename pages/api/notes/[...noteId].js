import connectMongoDB from "@/libs/mongodb";
import TopicNote from "@/models/mongoNotes";

export default async function handler(req, res) {
  const routeParts = req.url.split("/").filter((part) => part);
  const [UID, NID] = routeParts.slice(-2);

  const { title, text } = req.body;

  if (req.method === "DELETE") {
    try {
      await connectMongoDB();
      await TopicNote.findOneAndDelete({ userId: UID, id: NID });
      res.status(200).json({ message: "Note was deleted" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error when deleting" });
    }
  } else if (req.method === "GET") {
    try {
      await connectMongoDB();
      const info = await TopicNote.findOne({ userId: UID, id: NID });
      res.status(200).json(info);
      console.log(UID);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    try {
      await connectMongoDB();
      const newInfo = await TopicNote.findOneAndUpdate (
        { userId: UID, id: NID },
        {
          $set: {
            title: title,
            text: text,
          },
        }
      );
      res.status(200).json({ message: "note updated" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error when updating" });
    }
  }
}