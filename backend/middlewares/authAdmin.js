import jwt from "jsonwebtoken";

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    // Express lowercases header keys. Accept multiple header names just in case.
    const token = req.headers.atoken || req.headers.aToken || (req.headers.authorization?.split(' ')[1]);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized - Login Again",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized - Login Again",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export default authAdmin;
