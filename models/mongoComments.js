import mongoose, {Schema} from "mongoose";

const topicSchema = new Schema(
    {
        userId: String,
        id: Number,
        text: String,
        date: {
            month: Number,
            day: String,
            hour: String,
            minute: String,
            seconds: String,
        }
    }, {
        timestamps: true,
    }
)

const Topic = mongoose.models.Topic || mongoose.model("Topic", topicSchema);

export default Topic;
