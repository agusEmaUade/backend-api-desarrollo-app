const User = require('../models/User.model');


const getUsers = async () => {
   return await User.find().select('-password');
};


const getUserById = async (id) => {
   return await User.findById(id).select('-password');
};


const getUserByEmail = async (email) => {
   return await User.findOne({ email }).select('-password');
};


const createUser = async (userData) => {
   return await User.create(userData);
};


const getUserByEmailAndPassword = async (email, password) => {
   return await User.findOne({ email }).select('+password');
};


const updateUser = async (id, updatedFields) => {
   return await User.findByIdAndUpdate(
       id,
       updatedFields,
       { new: true, runValidators: true }
   ).select('-password');
};


const updateUserByEmail = async (email, updatedFields) => {
   try {
       const updatedUser = await User.findOneAndUpdate(
           { email },
           updatedFields,
           { new: true, runValidators: true }
       ).select('-password');
      
       if (!updatedUser) {
           throw new Error('No user found with the provided email.');
       }
      
       return updatedUser;
   } catch (error) {
       throw new Error(error.message);
   }
};


const deleteUser = async (id) => {
   return await User.findByIdAndDelete(id);
};


module.exports = {
   getUsers,
   getUserById,
   createUser,
   getUserByEmailAndPassword,
   updateUser,
   getUserByEmail,
   updateUserByEmail,
   deleteUser
};