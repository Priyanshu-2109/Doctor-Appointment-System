import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log("Database Connected"))

    // Ensure MONGODB_URI doesn't end with a trailing slash to avoid invalid namespace
    let uri = process.env.MONGODB_URI || ''
    if (uri.endsWith('/')) uri = uri.slice(0, -1)

    // Connect using dbName option instead of appending path manually.
    // This prevents creating invalid namespaces if the URI already contains a path.
    await mongoose.connect(uri, { dbName: 'carepoint', useNewUrlParser: true, useUnifiedTopology: true })

}

export default connectDB;
