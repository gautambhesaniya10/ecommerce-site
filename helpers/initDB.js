import mongoose from "mongoose";

const initDb = () => {
  if (mongoose.connections[0].readyState) {
    console.log("Aleready Connected");
    return;
  }

  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology:true
  });

  mongoose.connection.on("connected", () => {
    console.log("Connected To Mongo");
  });
  mongoose.connection.on("error", (err) => {
    console.log("error connecting", err);
  });
};

export default initDb;
