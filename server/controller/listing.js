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