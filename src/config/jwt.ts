import Jwt  from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || 'Secret_key';

// Generar token 
export const genToken = (payload: object): string => {
    return Jwt.sign(payload, SECRET_KEY, {
        expiresIn: '1h'
    });
};

// Verificar el token
export const verifyToken = (token: string): any => {
    try {
        return Jwt.verify(token, SECRET_KEY)
    } catch (error) {
        throw new Error('Token provided')
    }
};