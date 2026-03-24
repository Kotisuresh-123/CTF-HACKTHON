const mongoose = require('mongoose');


try {
    mongoose.connect(`${process.env.MONGODB_URL}`)
    .then(() => {
        console.log("successfully  connected");
    })
    .catch((e) => {
        console.log(e.message);
    })
} catch (error) {
    console.log(error.message);
}