const usermodel = require("../Model/UserModel")
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

/// multer
const uploadDir = path.join(__dirname, "../Uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

////
const Signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!password) {
            return res.status(400).send({ message: "Password is required" });
        }
        const image = req.file ? req.file.filename : null;

        const existingUser = await usermodel.findOne({ email })
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }
        const hashpassword = await bcrypt.hash(password, 10);
        const userdata = await usermodel.create({
            username,
            email,
            password: hashpassword,
            image
        })
        // res.send({ Message: "Signup successful", userdata })
        res.redirect("/user/login");
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send({ message: "An error occurred during signup" });
    }
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body

        const userdata = await usermodel.findOne({ email })
        if (!userdata) {
            return res.status(404).send({ message: "User not found" });
        }
        const ispasswordValid = await bcrypt.compare(password, userdata.password)
        if (!ispasswordValid) {
            return res.status(401).send({ message: "Incorrect password" });
        }
        const token = jwt.sign(
            { id: userdata._id, username: userdata.username, email: userdata.email, image: userdata.image },
            secretKey = process.env.SECRETKEY,
            { expiresIn: "1d" }
        )
        // res.send({ Message: "Login Successful", token })
        res.cookie("authToken", token, { httpOnly: true, secure: false });
        res.redirect("/user/home");
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send({ message: "An error occurred during login" });
    }
}

const Logout = async (req, res) => {
    try {
        res.clearCookie("authToken");
        // res.status(200).send({ message: "Logout successful" });
        res.redirect("/user/login");
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).send({ message: "An error occurred during logout" });
    }
};

// file Render Controllers
const signupFile = (req, res) => {
    res.render("signUP", { user: req.user });
};

const Loginfile = (req, res) => {
    res.render("login", { user: req.user });
};

const homefile = (req, res) => {
    res.render("Home", { user: req.user });
};

module.exports = {
    Signup: [upload.single("image"), Signup],
    Login,
    Logout,
    signupFile,
    Loginfile,
    homefile,
}


