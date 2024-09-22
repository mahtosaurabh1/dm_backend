const mongoose=require('mongoose');
const atlasUrl = "mongodb+srv://mahtosaurabh1:eCOYsNztl8ps7u61@shopmanagementcluster.87jtk.mongodb.net/data-management?retryWrites=true&w=majority&appName=shopmanagementcluster";
const localUrl='mongodb://localhost:27017/data-management'
mongoose.connect(localUrl)
  .then(() => console.log('Connected to DB'))
  .catch((error) => console.log(error));




  // --------------
  
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://mahtosaurabh1:eCOYsNztl8ps7u61@shopmanagementcluster.87jtk.mongodb.net/?retryWrites=true&w=majority&appName=shopmanagementcluster"

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
