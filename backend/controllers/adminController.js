import validator from 'validator';
import bcrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import Doctor from '../models/doctorModel.js';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';


// add doctor api from admin pannel
const addDoctor = async (req, res) => {
    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        // console.log({name, email, password, speciality, degree, experience, about, fees, address, imageFile});

        // Checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" });
        }

        //Validating email format
        if(!validator.isEmail(email)){
        return res.json({ success: false, message: "Please Enter a Valid Email" });
        }

        // Validating Strong password
        if(password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: 'image'
        });

        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: "Doctor Added Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message:error.message || "Internal Server Error" });
    }
}

//API for the admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validating email and password
        if (!email || !password) {
            return res.json({ success: false, message: "Please enter email and password" });
        }

        // Checking admin credentials
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({ success: true, message: "Login Successful", token });
        }
        else{
            return res.json({ success: false, message: "Invalid Credentials" });
        }
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message:error.message || "Internal Server Error" });
    }
}


export { addDoctor, loginAdmin };