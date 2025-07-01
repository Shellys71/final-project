import { Request } from "express";

const User = require("../models/user");

export interface AuthRequest extends Request {
  user: typeof User;
  token: string;
}