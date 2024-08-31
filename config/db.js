const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/data-management')
  .then(() => console.log('Connected to DB'))
  .catch((error) => console.log(error));