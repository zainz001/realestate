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
  