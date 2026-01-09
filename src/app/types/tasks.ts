export interface Task {
  _id?: string; // MongoDB ID
  id?: string | number; // Fallback or legacy ID
  name: string;
  description?: string;
  dateCreated?: string | Date;
  completed?: boolean;
}