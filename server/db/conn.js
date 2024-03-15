const mongoose = require('mongoose');
const DB = process.env.DATABASE;

mongoose.connect(DB)
.then(()=>{
    console.log('Connect hogyi')
})
.catch((err) => {
    console.log('No connection wapas check karo');
})