import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { catalogData } from '../apis';

export const getCatalogPageDetails = async(categoryId) => {
    const toastId = toast.loading("Loading...")
    let result = []

    try{
        console.log(categoryId)
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API,{
            categoryId: categoryId,
        });

        if(response){
            console.log("GET CATALOG PAGE DETAILS RESPONSE ===>>", response)
        }

        if(!response?.data?.success)
        throw new Error("Could not fetch Categorry page data");

        result = response?.data
    }
    catch(error){
        console.log("ERROR IN CATALOG PAGE DETAILS API...",error)
        toast.error(error.message)
        result = error.response?.data;
    }
    toast.dismiss(toastId);
    return result;
}