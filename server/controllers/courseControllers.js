import Course from "../models/Course.js";

// get all courses

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator" });

    console.log(courses);
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get single course
export const getCourseId = async (req, res) => {
  const { id } = req.params;
  try {
    const courseData = await Course.findById(id).populate({ path: "educator" });

    // remove lectureUrl if priview is not free

    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });
    res.json({ success: true, course: courseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
