const Classroom = require("../models/classroom.model");
const classroomSchema = require("../validations/classroom.validation");

const createClassroom = async (req, res) => {
  try {
    const result = classroomSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
      });
    }
    const { name, section, academicYear } = result.data;
    const { classTeacher } = req.body;

    const existingClass = await Classroom.findOne({
      name,
      section: section.toUpperCase(),
      academicYear,
    });
    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: "Classroom already exists",
      });
    }
    const classroom = await Classroom.create({
      name,
      section: section.toUpperCase(),
      academicYear,
      classTeacher,
    });
    return res.status(201).json({
      success: true,
      message: "Classroom created successfully",
      data: classroom,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllClassroom = async (req, res) => {
  try {
    const classrooms = await Classroom.find().populate({
      path: "classTeacher",
      select: "employeeId user",
      populate: {
        path: "user",
        select: "name email",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Classroom fetched successfully",
      data: classrooms,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getClassroomById = async (req, res) => {
  try {
    const { id } = req.params;
    const classroom = await Classroom.findById(id).populate({
      path: "classTeacher",
      select: "employeeId user",
      populate: {
        path: "user",
        select: "name email",
      },
    });
    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Classroom fetched successfully",
      data: classroom,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateClassroom = async (req, res) => {
  try {
    const { id } = req.params;

    const classroom = await Classroom.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: classroom,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const classroom = await Classroom.findByIdAndDelete(id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Classroom deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getPublicClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find().select("name section");

    return res.status(200).json({
      success: true,
      message: "Classrooms fetched successfully",
      data: classrooms,
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
  createClassroom,
  getAllClassroom,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
  getPublicClassrooms,
};
