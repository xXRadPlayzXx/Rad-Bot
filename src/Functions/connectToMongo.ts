import _mongoose from "mongoose";

const connectToMongo: Function = async (): Promise<any> => {
  const mongoose = await _mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  return mongoose;
};
export default connectToMongo;
