import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITask extends Document {
  name: string;
  description: string;
  dateCreated: Date;
  userId: string;
}

const TaskSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this task.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this task.'],
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
});

// Check if the model is already compiled to prevent OverwriteModelError
const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
