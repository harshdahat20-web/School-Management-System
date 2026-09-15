const User = require("../models/user.model");
const Teacher = require("../models/teacher.model");
const {
  createTeacherSchema,
  selfRegisterSchema,
} = require("../validations/teacher.validation");

const createTeacher = async (req, res) => {
  try {
    const result = createTeacherSchema.safeParse(req.body);

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
      employeeId,
      subjects,
      qualification,
      phone,
    } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const existingEmployeeId = await Teacher.findOne({ employeeId });
    if (existingEmployeeId) {
      return res.status(400).json({
        success: false,
        message: "This employee ID is already in use",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "teacher",
    });

    const teacher = await Teacher.create({
      user: user._id,
      employeeId,
      subjects,
      qualification,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: teacher,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("user", "name email");

    return res.status(200).json({
      success: true,
      message: "Teachers fetched successfully",
      data: teachers,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id).populate("user", "name email");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Teacher fetched successfully",
      data: teacher,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    await Teacher.findByIdAndDelete(id);
    await User.findByIdAndDelete(teacher.user);

    return res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const selfRegisterTeacher = async (req, res) => {
  try {
    const result = selfRegisterSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
      });
    }

    const { name, email, password, subjects, qualification, phone } =
      result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "teacher",
      status: "pending",
    });

    // Generate employeeId from the current MAX value (not a document count),
    // and retry a few times on a duplicate-key race so two near-simultaneous
    // registrations can never collide on the same employeeId.
    const MAX_ATTEMPTS = 5;
    let created = null;
    let lastError = null;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const lastTeacher = await Teacher.findOne({
        employeeId: { $regex: /^EMP-\d+$/ },
      })
        .sort({ employeeId: -1 })
        .select("employeeId")
        .lean();

      const lastNumber = lastTeacher
        ? parseInt(lastTeacher.employeeId.split("-")[1], 10)
        : 0;
      const employeeId = `EMP-${String(lastNumber + 1 + attempt).padStart(4, "0")}`;

      try {
        created = await Teacher.create({
          user: user._id,
          employeeId,
          subjects,
          qualification,
          phone,
        });
        break;
      } catch (teacherErr) {
        lastError = teacherErr;
        if (teacherErr?.code !== 11000) break;
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
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  selfRegisterTeacher,
};
