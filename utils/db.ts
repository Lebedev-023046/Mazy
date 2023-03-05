import mongoose from "mongoose";

const connection = {
  isConnected: 0,
};

async function connect() {
  if (connection?.isConnected) {
    console.log("Already connected");
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log("Use previous connection");
      return;
    }
    await mongoose.disconnect();
  }
  mongoose.set("strictQuery", false);
  const db = await mongoose.connect(String(process.env.MONGODB_URI));
  console.log("new connection");
  connection.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = 0;
    } else {
      console.log("not disconnected");
    }
  }
}

const db = { connect, disconnect };
export default db;
