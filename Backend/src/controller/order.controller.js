import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../model/order.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getOrder = asyncHandler(async (req, res) => {
  //   const { name, email, contact, frameSize } = req.body;

  //   const order = await User.create({
  //     name,email,contact,frameSize
  //   })

  //   if(!order){
  //     throw new ApiError(500,"Somthing went wrong");
  //   }

  //   return res.status(200).json(new ApiResponse(200,order,"Order SuccessFull"))
  try {
    // text fields
    const { name, email, contact, frameSize } = req.body;

    // file
    const image = req.file;
    // console.log(image)

    // ---------- Validation ----------
    if (!name || !email || !contact || !frameSize) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!image) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    if (!/^\d{10,}$/.test(contact)) {
      return res.status(400).json({
        message: "Invalid contact number",
      });
    }

    const imageCloudPath = await uploadOnCloudinary(image.path);
    const allowedSizes = ["small", "medium", "large", "extra-large"];
    if (!allowedSizes.includes(frameSize)) {
      return res.status(400).json({
        message: "Invalid frame size",
      });
    }

    // ---------- What you now have ----------
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Contact:", contact);
    console.log("Frame Size:", frameSize);
    console.log("Image Path:", imageCloudPath.secure_url);

    // ---------- Example DB save ----------
    
    const user = await User.create({
      name,
      email,
      contact,
      frameSize,
      image: imageCloudPath.secure_url,
    });
    
    console.log(user);
    
    return res.status(201).json({
      success: true,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export { getOrder };
