import User from "../modules/user.module.js";
import { errorhandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'
import Listing from "../modules/listingmodule.js"
export const updateuser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
      return next(errorhandler(401, 'You can only update your own account!'));
    try {
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
          },
        },
        { new: true }
      );
  
      const { password, ...rest } = updatedUser._doc;
  
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };

  export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
      return next(errorhandler(401, 'You can only delete your own account!'));
    try {
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie('access_token');
      res.status(200).json('User has been deleted!');
    } catch (error) {
      next(error);
    }
  };


export const getUserlisting=async (req,res,next)=>{
if (req.user.id ===req.params.id)
{
try {
  const listing= await Listing.find({userRef:req.params.id})
  res.status(200).json(listing);
} catch (error) {
  next(error);
}

}
else{
  return next(errorhandler(401,'you can see only your own listing'))
}
  }