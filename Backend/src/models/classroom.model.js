const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Classroom is required"],
      trim: true,
    },
    section: {
      type: String,
      required: [true, "Section is required"],
      trim: true,
      uppercase: true,
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },
    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
    },
  },
  {
    timestamps: true,
  },
);

classroomSchema.index(
  { name: 1, section: 1, academicYear: 1 },
  { unique: true },
);

const Classroom = mongoose.model("Classroom", classroomSchema);

module.exports = Classroom;
