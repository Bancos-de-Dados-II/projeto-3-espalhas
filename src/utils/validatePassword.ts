import bcrypt from "bcrypt";

export async function validatePassword(password: string, userPassword: string): Promise<boolean> {
    if (password === undefined || password === null || password === '') {
        throw new Error("Password argument is required and cannot be empty");
    }
    
    if (userPassword === undefined || userPassword === null || userPassword === '') {
        throw new Error("Hashed password argument is required and cannot be empty");
    }
    
    if (typeof password !== 'string') {
        throw new Error("Password must be a string");
    }
    
    if (typeof userPassword !== 'string') {
        throw new Error("Hashed password must be a string");
    }
    
    return await bcrypt.compare(password, userPassword);
}