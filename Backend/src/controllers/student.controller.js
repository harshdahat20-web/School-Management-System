const User = require("../models/user.model");
const Student = require("../models/student.model");
const Classroom = require("../models/classroom.model");
const {
  createStudentSchema,
  selfRegisterSchema,
} = require("../validations/student.validation");

const createStudent = async (req, res) => {
  try {
    const result = createStudentSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
      });
    }

    const {
      name,
      email,
      password,
      admissionNumber,
      classRoom,
      rollNumber,
      dateOfBirth,
      gender,
      parentName,
      parentPhone,
      address,
    } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const existingAdmissionNumber = await Student.findOne({ admissionNumber });
    if (existingAdmissionNumber) {
      return res.status(400).json({
        success: false,
        message: "This admission number is already in use",
      });
    }

    const existingRollNumber = await Student.findOne({
      classRoom,
      rollNumber,
    });
    if (existingRollNumber) {
      return res.status(400).json({
        success: false,
        message: "This roll number is already assigned in this class",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "student",
    });

    const student = await Student.create({
      user: user._id,
      admissionNumber,
      classRoom,
      rollNumber,
      dateOfBirth,
      gender,
      parentName,
      parentPhone,
      address,
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const { classRoom } = req.query;

    const filter = classRoom ? { classRoom } : {};

    const students = await Student.find(filter)
      .populate("user", "name email")
      .populate("classRoom", "name section academicYear");

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id)
      .populate("user", "name email")
      .populate("classRoom", "name section academicYear");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student fetched successfully",
      data: student,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await Student.findByIdAndDelete(id);
    await User.findByIdAndDelete(student.user);

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const selfRegisterStudent = async (req, res) => {
  try {
    const result = selfRegisterSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
      });
    }

    const {
      name,
      email,
      password,
      classRoom,
      dateOfBirth,
      gender,
      parentName,
      parentPhone,
      address,
    } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const classroomDoc = await Classroom.findById(classRoom);
    if (!classroomDoc) {
      return res.status(400).json({
        success: false,
        message: "Selected class does not exist",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "student",
      status: "pending",
    });

    const cleanGender = gender || undefined;

    // Generate admissionNumber/rollNumber from the current MAX value (not a
    // document count), and retry a few times on a duplicate-key race so two
    // near-simultaneous registrations can never collide on the same number.
    const MAX_ATTEMPTS = 5;
    let created = null;
    let lastError = null;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const lastStudent = await Student.findOne({
        admissionNumber: { $regex: /^STU-\d+$/ },
      })
        .sort({ admissionNumber: -1 })
        .select("admissionNumber")
        .lean();

      const lastNumber = lastStudent
        ? parseInt(lastStudent.admissionNumber.split("-")[1], 10)
        : 0;
      const admissionNumber = `STU-${String(lastNumber + 1 + attempt).padStart(4, "0")}`;

      const lastInClass = await Student.findOne({ classRoom })
        .sort({ rollNumber: -1 })
        .select("rollNumber")
        .lean();
      const lastRoll = lastInClass
        ? parseInt(lastInClass.rollNumber, 10) || 0
        : 0;
      const rollNumber = String(lastRoll + 1 + attempt);

      try {
        created = await Student.create({
          user: user._id,
          admissionNumber,
          classRoom,
          rollNumber,
          dateOfBirth,
          gender: cleanGender,
          parentName,
          parentPhone,
          address,
        });
        break;
      } catch (studentErr) {
        lastError = studentErr;
        // Only retry on a duplicate-key race (code 11000); anything else is
        // a real error and should fail immediately.
        if (studentErr?.code !== 11000) break;
      }
    }

    if (!created) {
      await User.findByIdAndDelete(user._id);
      throw lastError;
    }

    return res.status(201).json({
      success: true,
      message: "Registered successfully, waiting for admin approval",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
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
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  selfRegisterStudent,
};
