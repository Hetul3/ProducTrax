import connectMongoDB from "@/libs/mongodb";
import TopicNote from "@/models/mongoNotes";

export default async function handler(req, res) {
  const routeParts = req.url.split('/').filter(part => part); 
  const [UID, NID] = routeParts.slice(-2); 

  //info of the changed stuff for the update
  const {title, text} = req.body;

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



    //currently trying to get the update feature to work
  } else if(req.method === "PUT") {
    try {
      await connectMongoDB();
      
      const upatedNote = await TopicNote.fineOneAndUpdate(
        {userId: UID, id: NID}, 
        {
          $set: {

          }
        }
      )
    } catch(error) {
      res.status(500).json({error: "Internal server error"});
    }
  }
}
