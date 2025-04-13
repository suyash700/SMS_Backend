const mongoose=require('mongoose')

const MONGO_URL=process.env.MONGO_URI

// mongoose.connect(MONGO_URI)

const connectDB=async () => {
    try {
        
       await mongoose.connect(MONGO_URL) ;
       console.log("Connection successful to DB ",MONGO_URL);
       
    } catch (error) {
        console.log(error)
        console.error("db connection failed");
        process.exit(0);
    }
}

module.exports =connectDB