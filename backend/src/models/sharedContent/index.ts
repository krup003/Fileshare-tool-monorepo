import mongoose from "mongoose";

const SharedContentSchema = new mongoose.Schema(
  {
    privacyType: {
      type: String,
      enum: ["public", "private"],
      required: true,
    },
    otp: {
      type: Number,
      required: function (this: { privacyType: string }): boolean {
        return this.privacyType === "private";
      },
      default: null,
    },
    contentUrl: {
      type: String,
      required: true,
    },
    uniqueUserCode: {
      type: String,
      required: true,
    },
    file: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
      originalName: {
        type: String,
        required: true,
      },
      mimeType: {
        type: String,
        required: true,
      },
      fileType: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const SharedContentModel = mongoose.model(
  "SharedContent",
  SharedContentSchema,
);
