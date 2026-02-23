import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Interface representing the Event document in MongoDB.
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema<IEvent> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    overview: { type: String, required: true },
    image: { type: String, required: true },
    venue: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true },
    audience: { type: String, required: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true },
    tags: { type: [String], required: true },
  },
  {
    timestamps: true,
  },
);

/**
 * Pre-save hook for slug generation, date normalization, and time formatting.
 */
EventSchema.pre<IEvent>("save", function (next: any) {
  // 1. Generate slug from title if it's new or modified
  if (this.isModified("title")) {
    this.slug = generateSlug(this.title);
  }

  // 2. Normalize date to ISO format (YYYY-MM-DD) if modified
  if (this.isModified("date")) {
    this.date = normalizeDate(this.date);
  }

  // 3. Normalize time (Ensuring trim and consistency)
  if (this.isModified("time")) {
    this.time = this.time.trim().toUpperCase();
  }

  next();
});

function normalizeDate(date: string): string {
  const parsedDate = new Date(date);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().split("T")[0];
  }
  return date;
}
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-alphanumeric except spaces/hyphens
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Trim hyphens
}

/**
 * Export the Event model.
 * Reuses existing model if already compiled (Next.js HMR support).
 */
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
