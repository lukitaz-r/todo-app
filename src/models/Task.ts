import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface representing a Task document in MongoDB.
 * Interfaz que representa un documento de Tarea en MongoDB.
 */
export interface ITask extends Document {
  name: string;
  description?: string;
  dateCreated: Date;
  userId: string;
  completed: boolean; // Added missing property / Propiedad faltante añadida
}

/**
 * Mongoose Schema for the Task model.
 * Esquema de Mongoose para el modelo Task.
 */
const TaskSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this task.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  description: {
    type: String,
    required: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  // userId corresponds to the deviceId cookie
  // userId corresponde a la cookie deviceId
  userId: {
    type: String,
    required: true,
    index: true, // Indexed for faster retrieval / Indexado para recuperación más rápida
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// Check if the model is already compiled (for serverless environments)
// Verificar si el modelo ya está compilado (para entornos serverless)
const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
