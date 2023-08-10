import mongoose, {Schema} from "mongoose";

const noteSchema = new Schema(
    {
        userId: String,
        id: Number,
        title: String,
        text: String
    }, {
        timestamps: true,
    }
)

const TopicNote = mongoose.models.TopicNote || mongoose.model("TopicNote", noteSchema);

export default TopicNote;