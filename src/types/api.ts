import { JwtPayload } from "jsonwebtoken";
import { Request } from "express"

interface ProtectedRequest extends Request {
    user? : CustomJwtPayload;
}

interface CustomJwtPayload extends JwtPayload {
    id : string;
    password : string; 
}

export default ProtectedRequest