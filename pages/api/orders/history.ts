import Order from "@/models/Order";
import db from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({
      message: "signin required",
    });
  }
  const { user } = session;
  await db.connect();
  const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
  await db.disconnect();
  res.send(orders);
};

export default handler;
