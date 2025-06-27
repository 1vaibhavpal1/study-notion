const SubSection = require('../models/SubSection')
const Section = require('../models/Section')
const { imageUploader } = require('../utils/imageUploader')
require("dotenv").config()
const mongoose = require('mongoose')
const { findById } = require('../models/OTP')
//create SubSection
module.exports.createSubSection = async function createSubSection(req, res) {
    try {
        //fetch data from req body
        const { sectionId, title, description } = req.body;
        //extract file/video
        const video = req.files.video;
        //validation
        if (!sectionId || !title || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        //upload video to cloudinary
        const uploadDetails = await imageUploader(video, process.env.FOLDER_NAME);

        console.log("Upload Details ==>> ", uploadDetails)
        //create a sub-section
        const SubSectionDetails = await SubSection.create({
            title: title,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })
        //update section with this subSection ObjectId
        const updateSection = await Section.findByIdAndUpdate({ _id: sectionId },
            {
                $push: {
                    subSection: SubSectionDetails._id,
                }
            },
            { new: true }).populate("subSection").exec();

        //return response
        return res.status(200).json({
            success: true,
            message: "Sub Section created successfully",
            data: updateSection
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error in creating Sub section "
        })
    }
};

//updating Sub Section
module.exports.updateSubSection = async (req, res) => {
    try {
      console.log("UPDATE SUB-SECTION REQUEST RECEIVED");
      console.log("req.body:", req.body);
      console.log("req.files:", req.files);
      const { sectionId, subSectionId, title, description } = req.body
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await imageUploader(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
  
      // find updated section and return it
      const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
      )
  
      console.log("updated section", updatedSection)
  
      return res.json({
        success: true,
        message: "Section updated successfully",
        data: updatedSection,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
}

//deleting Sub Section
module.exports.deleteSubSection = async function deleteSubSection(req, res) {
    try {
        console.log("DELETE SUB-SECTION REQUEST RECEIVED");
        console.log("req.body:", req.body);
        //getting id
        const { subSectionId, sectionId } = req.body;

        //removing subSection from Section
        await Section.findByIdAndUpdate(sectionId, {
            $pull: {
                subSection: subSectionId,
            },
        });

        //deleting
        await SubSection.findByIdAndDelete(subSectionId);

        //find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate("subSection");

        //returning response
        return res.status(200).json({
            success: true,
            message: "Sub Section Deleted Successfully",
            data: updatedSection
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error in deleting Sub Section"
        })
    }
}