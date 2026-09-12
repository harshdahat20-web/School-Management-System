const User = require("../models/user.model");
const Student = require("../models/student.model");
const { createStudentSchema } = require("../validations/student.validation");

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

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
