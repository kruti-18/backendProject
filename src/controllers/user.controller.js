import {asyncHandler} from '../utills/asyncHandler.js'
import {ApiError} from '../utills/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utills/cloudinary.js'
import { ApiResponse } from '../utills/ApiResponse.js'

 
const registerUser = asyncHandler(async(req, res) => {
    // get user details from frontend
    // validation not empty
    // if user already exists -  username, email
    // check for image, check for avatar,
    // create user object, create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullname, email, username, password} = req.body
    console.log(req.body);

    if(
        [fullname, email, password, username].some((field) => 
            field?.trim() === '')
    ){
        throw new ApiError(400, 'all fields are required')
    }

    // if(fullname === ''){
    //     throw new ApiError(400, 'fullname is required')
    // }

    const exisitngUser = User.findOne({
        $or: [{ username }, { email }]
    })

    console.log(exisitngUser);
    if(exisitngUser){
        throw ApiError(409, 'user with name/email already exists')
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    console.log(avatarLocalPath, coverImageLocalPath);

    if(!avatarLocalPath) throw new ApiError(400, 'AVATAR IS REQUIRED')
    // if(!coverImageLocalPath) throw new ApiError(400, 'COVER IMAGE IS REQUIRED')

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, 'AVATAR IS REQUIRED')
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || '',
        email ,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById( user._id ).select(
        '-password -refreshToken'
    )   

    if(!createdUser) throw new ApiError(500, 'something went wrong while registering the user')

    return res.status(201).json(
        new ApiResponse(200, createdUser, 'user created')
    )
})

export {registerUser}