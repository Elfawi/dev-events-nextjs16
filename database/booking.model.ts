import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * Interface representing the Booking document in MongoDB.
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema<IBooking> = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Pre-save hook to verify event existence.
 */
BookingSchema.pre<IBooking>("save", async function (next: any) {
  // Verify referenced event exists
  if (this.isModified("eventId")) {
    const eventExists = await mongoose
      .model("Event")
      .exists({ _id: this.eventId });
    if (!eventExists) {
      return next(new Error(`Event with ID ${this.eventId} does not exist.`));
    }
  }
  next();
});

BookingSchema.index({ eventId: 1 });
BookingSchema.index({ eventId: 1, createdAt: -1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });
/**
 * Export the Booking model.
 * Reuses existing model if already compiled (Next.js HMR support).
 */
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
