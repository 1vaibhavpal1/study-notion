const Section = require('../models/Section')
const Course = require('../models/Course')
const SubSection = require('../models/SubSection')

//creating a section
module.exports.createSection = async function createSection(req,res){
    try{
        //fetch details
        const{sectionName, courseId} = req.body;
        //validate data
        if(!sectionName || !courseId){
            return res.status(401).json({
                success: false,
                message: "Please fill all the details"
           })
        }
        //create new section
        const newSection = await Section.create({sectionName});
        //updating course with sectio id
        const newCourse = await Course.findByIdAndUpdate(
        courseId,
            {
                $push:{
                    courseContent: newSection._id,
                },
            },
            {new: true},)
            .populate({
                path: "courseContent",
                populate : {
                    path: "subSection"
                }
            })
            .exec()

        //return response
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            data : newCourse
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: `Errror in creating Sectiion : ${err.message}`
        })
    }
}

//update Section
module.exports.updateSection = async function updateSection(req,res){
    try{
        //fetch details
        const{sectionName,sectionId, courseId} = req.body
        //validation
        if(!sectionName || !sectionId){
            return res.status(401).json({
                success: false,
                message: "Please enter all the details",
            })
        }
        //update data
        const upatedSection = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true})

        const updatedCourse = await Course.findById(courseId).populate({
            path: "courseContent",
            populate:{
                path:"subSection"
            }
        })
        .exec()


        //return res
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data : updatedCourse
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message: `Error in updating Section ${err.message}`
        })
    }
}

//deleting Section
module.exports.deleteSection = async function deleteSection(req,res){
    try{
        //fetch detaisl
        const {sectionId, courseId} = req.body;

        //course ke andar se b vo section delete krdo
        await Course.findByIdAndUpdate(courseId,{
            $pull:{
                courseContent : sectionId,
            }
        })

        //find section
        const section = await Section.findById(sectionId);
        if(!section){
            return res.status(404).json({
                success: false,
                message: "Section not found",
            })
        }

        //delete sub section
        await SubSection.deleteMany({_id: {$in: section.subSection}});

        //delete Section
        await Section.findByIdAndDelete(sectionId);

        //find the updated course and return 
        const course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec()
   
        //returning res
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            data: course
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: `Error in deletin Section ${err.message}`
        })
    }
}