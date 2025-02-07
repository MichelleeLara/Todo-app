import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    return jwt.sign(
        { userId }, // Payload
        process.env.JWT_SECRET, // Clave secreta
        { expiresIn: "1h" } // Expiración
    );
};

export default generateToken;
