import User from "@/models/User";
import db from "@/utils/db";
import bcryptjs from "bcryptjs";
import IUser from "../../../types/IUser";
import { NextApiRequest, NextApiResponse } from "next";

interface IRequestBody {
  name: string;
  email: string;
  password: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return;
  }
  const { name, email, password }: IRequestBody = req.body;
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 8
  ) {
    res.status(422).json({
      message: "Validation Error",
    });
    return;
  }

  await db.connect();
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(422).json({
      message: "User is already exists",
    });
    await db.disconnect();
    return;
  }

  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false,
  });

  const user: IUser = await newUser.save();
  await db.disconnect();
  res.status(201).json({
    message: "The user has been created!",
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

export default handler;
