const Category = require('../models/Category')
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}
//creating a Category
module.exports.createCategories = async function createCategory(req, res) {
    try {
        //fetching details
        const { name, description } = req.body;

        //validation
        if (!name || !description) {
            return res.json({
                success: false,
                message: "All fields must be filled",
            })
        }
        //create entry in db

        const CategoryDetails = await Category.create({
            name: name,
            descrition: description,
        })

        console.log(CategoryDetails);
        return res.status(200).json({
            success: true,
            message: `Category created successfuly`
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `Error in creatin Category: ${err.message}`,
        })
    }
}

//fetching all Categorys
module.exports.showAllCategories = async function showAllCategorys(req, res) {
    try {
        //fetching all Categorys
        const Categorys = await Category.find({}, { name: true, description: true });
        return res.json({
            success: true,
            message: "all Categorys Fetched",
            Categorys,
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `Error in fetching Categorys ${err.message}`
        })

    }
}

//category page details ka ek function aega github se dekhlena wheneever situation arises
module.exports.categoryPageDetails = async function categoryPageDetails(req, res) {
    try {
        //category id
        // console.log("REQ IS ==>> ", req)
        const { categoryId } = req.body;

        //selected Categgory
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "course",
                match: { status: "Published" }
                // populate: "ratingAndReviews"
            })
            .exec()

        if (!selectedCategory) {
            console.log("Course not found");
            return res.json({
                success: false,
                message: "Category not found"
            })
        }

        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })
        let diffCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                ._id
        ).populate({
            path: "course",
            match: { status: "Published" },
        })
            .exec();

        //top selling courses
        //firstly getting all the courses
        const AllCategories = await Category.find().populate({
            path: "course",
            match: { status: "Published" },
            populate: {
                path: "instructor"
            }
        }).exec()

        const AllCourses = AllCategories.flatMap((category) => category.course)
        // console.log("ALl Courses ==>", AllCourses)

        // const mostSellingCourse = AllCourses.sort({ studentsEnrolled: -1 }).limit(10);
        const mostSellingCourse = AllCourses

        // console.log(mostSellingCourse);

        //return res
        res.status(200).json({
            success: true,
            data:
                selectedCategory,
            diffCategory,
            mostSellingCourse,
        })
    }
    catch (err) {
        console.log("ERROR IS ===> ", err)
        return res.json({

            success: false,
            message: "Error in Categoru controller Categoryu PAge Details"
        })
    }
}