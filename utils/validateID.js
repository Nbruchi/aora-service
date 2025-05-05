const mongoose = require('mongoose');

const validateID = (id) => {
    if (!id){
        throw new Error('No ID provided');
    }

    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid){
        throw new Error('Invalid ID');
    }
}

module.exports = validateID;