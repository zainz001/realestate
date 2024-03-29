import Listing from "../modules/listingmodule.js";

import { errorhandler } from "../utils/error.js"
export const createListing = async (req, res, next) => {
    try {
      const listing = await Listing.create(req.body);
      return res.status(201).json(listing);
    } catch (error) {
      next(error);
    }
  };

  export const deletelisting = async (req, res, next) => {
    try {
      const listing = await Listing.findOne({ _id: req.params.id });
  
      if (!listing) {
        return next(errorhandler(404, "Listing not found"));
      }
  
      if (req.user.id !== listing.userRef) {
        return next(errorhandler(403, "You can delete only your listing"));
      }
  
      await Listing.findByIdAndDelete(req.params.id);
      res.status(202).json("Successfully deleted");
    } catch (error) {
      next(error);
    }
  };
  

  export const updatelisting = async (req, res, next) => {
    try {
      const listing = await Listing.findOne({ _id: req.params.id });
  
      if (!listing) {
        return next(errorhandler(404, "Listing not found"));
      }
  
      if (req.user.id !== listing.userRef) {
        return next(errorhandler(403, "You can update only your listing"));
      }
  
      const updatedListing = await Listing.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
  
      res.status(202).json(updatedListing);
    } catch (error) {
      next(error);
    }
  };
  
  export const getListing = async (req, res, next) => {
    try {
      const listing = await Listing.findById({ _id: req.params.id });
      if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
      }
      res.status(200).json(listing);
    } catch (error) {
      next(error);
    }
  };
  
  export const getlistings= async(req,res,next)=>{
    //   try {
    //     const limit=parseInt(req.query.limit)||9;//if there is limit then use that limit other wise use 9
    //     const startIndex=parseInt(req.query.startIndex)||0;
    //     let offer=req.query.offer
    //     if (offer==='undefined'||offer==='false') {
    //       offer={$in:[false,true]}//search in the data base its true or false
    //       //in this logic its show all the post if use select offer then search its shows offer post otherwise all post
  
    //     }
  
  
    //   } catch (error) {
    //     next(error)
    //   }
    // }
    try {
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;
      let offer = req.query.offer;
  
      if (offer === undefined || offer === 'false') {
        offer = { $in: [false, true] };
      }
  
      let furnished = req.query.furnished;
  
      if (furnished === undefined || furnished === 'false') {
        furnished = { $in: [false, true] };
      }
  
      let parking = req.query.parking;
  
      if (parking === undefined || parking === 'false') {
        parking = { $in: [false, true] };
      }
  
      let type = req.query.type;
  
      if (type === undefined || type === 'all') {
        type = { $in: ['sale', 'rent'] };
      }
  
      const searchTerm = req.query.searchTerm || '';
  
      const sort = req.query.sort || 'createdAt';
  
      const order = req.query.order || 'desc';
  
      const listings = await Listing.find({
        name: { $regex: searchTerm, $options: 'i' },//regex in search for if only 1 alphabet is in that search it will show that post also
        //i mean this use for dont effect by lower case or upper case 
        offer,
        furnished,
        parking,
        type,
      })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
  
      return res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  };