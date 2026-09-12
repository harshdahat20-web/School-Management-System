const Attendance = require("../models/attendance.model");
const {
  markAttendanceSchema,
} = require("../validations/attendance.validation");

const markAttendance = async (req, res) => {
  try {
    const result = markAttendanceSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
      });
    }

    const { classRoom, date, records } = result.data;

    const operations = records.map(({ student, status }) => ({
      updateOne: {
        filter: { student, date },
        update: {
          $set: {
            student,
            classRoom,
            date,
            status,
            markedBy: req.user.userId,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(operations);

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getClassAttendance = async (req, res) => {
  try {
    const { classRoom, date } = req.query;

    if (!classRoom || !date) {
      return res.status(400).json({
        success: false,
        message: "classRoom and date are required",
      });
    }

    const attendance = await Attendance.find({ classRoom, date }).populate(
      "student",
      "rollNumber",
    );

    return res.status(200).json({
      success: true,
      message: "Attendance fetched successfully",
      data: attendance,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const attendance = await Attendance.find({ student: studentId }).sort({
      date: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Attendance history fetched successfully",
      data: attendance,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  markAttendance,
  getClassAttendance,
  getStudentAttendance,
};
