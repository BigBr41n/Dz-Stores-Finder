import Store from "../models/store.model";
import { RATING, STORE } from "../utils/types";
import { ApiError } from "../utils/apiError";
import logger from "../utils/logger";
import { IStoreDocument } from "../models/store.model";
import User from "../models/user.model";
import { Schema } from "mongoose";
import path from "path";
import fs from 'fs'












/**
 * Service to create a new store.
 * @param {string} userId - The ID of the user making the create request.
 * @param {STORE} storeData - The new data for the store.
 * @returns {Promise<IStoreDocument>} - The created store document.
 * @throws {ApiError} - Throws an ApiError if the store creation fails.
 */
export const addNewStoreService = async (
  userId: string,
  storeData: STORE
): Promise<IStoreDocument> => {
  try {
    //creating new store
    const newStore = await Store.create({
      storeName: storeData.name,
      description: storeData.description,
      phone: storeData.phone,
      email: storeData.email,
      website: storeData.website,
      keywords: storeData.keywords,
      storeOwner: userId, //the user id of the logged in user , that got from middleware
      wilaya: storeData.wilaya,
      city: storeData.city,
      longitude: storeData.longitude,
      latitude: storeData.latitude,
      storeType: storeData.storeType,
    });

    //if the store didn't created successfully
    if (!newStore) {
      logger.warn("store didn't created successfully");
      throw new ApiError("Internal server Error", 500);
    }

    //return the new store created document
    return newStore;
  } catch (err: any) {
    logger.error("Error while updating a store", {
      error: err.message,
      stack: err.stack,
    });

    // Re-throw known ApiErrors
    if (err instanceof ApiError) throw err;

    // Throw a generic server error for unknown issues
    throw new ApiError(
      "Internal Server Error: An unexpected error occurred during creating a store",
      500
    );
  }
};











/**
 * Service to update an existing store.
 * @param {string} userId - The ID of the user making the update request.
 * @param {string} storeId - The ID of the store to update.
 * @param {STORE} storeData - The new data for the store.
 * @returns {Promise<IStoreDocument>} - The updated store document.
 * @throws {ApiError} - Throws an ApiError if the store update fails.
 */
export const updateStoreService = async (
  userId: string,
  storeId: string,
  storeData: STORE
): Promise<IStoreDocument> => {
  try {
    // find the store by its ID
    const store = await Store.findById(storeId);

    // if the store does not exist, throw a 400 error
    if (!store) {
      logger.warn("Store not found", { storeId });
      throw new ApiError("Store not found", 400);
    }

    // check if the user is the owner of the store
    if (store.storeOwner.toString() !== userId) {
      logger.warn("Unauthorized update attempt", { storeId, userId });
      throw new ApiError("Unauthorized!", 401);
    }

    // update the store with the new data
    const updatedStore = await Store.findByIdAndUpdate(storeId, storeData, {
      new: true,
    });

    // if the update failed, throw a 500 error
    if (!updatedStore) {
      logger.error("Store update failed", { storeId });
      throw new ApiError("Internal Server Error", 500);
    }

    // log the successful update
    logger.info("Store updated successfully", { storeId });

    return updatedStore;
  } catch (err: any) {
    logger.error("Error while updating a store", {
      error: err.message,
      stack: err.stack,
    });

    // Re-throw known ApiErrors
    if (err instanceof ApiError) {
      throw err;
    }

    // Throw a generic server error for unknown issues
    throw new ApiError(
      "Internal Server Error: An unexpected error occurred during store update",
      500
    );
  }
};











/**
 * service to delete an existing store
 * @param {string} userId - the logged in user id
 * @param {string} storeId - the store id to be deleted
 * @returns {Promise<boolean>} - boolean indicating
 * @throws {ApiError} - if an error occurred while deleting the store
 * */
export const deleteStoreService = async (
  userId: string,
  storeId: string
): Promise<boolean> => {
  try {
    const store = await Store.findById(storeId);

    // if the store does not exist, throw a 400 error
    if (!store) {
      logger.warn("Store not found", { storeId });
      throw new ApiError("Store not found", 400);
    }

    // check if the user is the owner of the store
    if (store.storeOwner.toString() !== userId) {
      logger.warn("Unauthorized update attempt", { storeId, userId });
      throw new ApiError("Unauthorized!", 401);
    }

    // delete the store
    await Store.findByIdAndDelete(storeId);

    return true;
  } catch (err: any) {
    logger.error("Error while deleting a store", {
      error: err.message,
      stack: err.stack,
    });

    // Re-throw known ApiErrors
    if (err instanceof ApiError) {
      throw err;
    }

    // Throw a generic server error for unknown issues
    throw new ApiError(
      "Internal Server Error: An unexpected error occurred during store update",
      500
    );
  }
};












/**
 * service to delete an existing store
 * @returns {Promise<IStoreDocument[] | undefined>} - return all stores found or undefined
 * @throws {ApiError} - if an error occurred while retrieving stores
 * */
export const getAllStoresService = async (): Promise<
  IStoreDocument[] | undefined
> => {
  try {
    //find all stores and returns them
    const stores = await Store.find();

    //if there are no stores
    if (!stores) {
      logger.warn("No stores found");
      return undefined;
    }

    //if there are any stores
    return stores;
  } catch (err: any) {
    logger.error("Error while getting all stores ", {
      error: err.message,
      stack: err.stack,
    });

    // Re-throw known ApiErrors
    if (err instanceof ApiError) {
      throw err;
    }

    // Throw a generic server error for unknown issues
    throw new ApiError(
      "Internal Server Error: An unexpected error occurred during retrieving all stores",
      500
    );
  }
};












/**
 *@param {string} storeId - the id of the store
 *@returns {Promise<IStoreDocument | undefined>} - a promise that resolves when the store found
 *@throws {ApiError} - if an error occurs during retrieving the store
 **/
export const getStoreByIdService = async (
  storeId: string
): Promise<IStoreDocument | undefined> => {
  try {
    //find the store by its id and return it
    const store = await Store.findById(storeId);

    //if there are no store with
    if (!store) {
      logger.warn("No Store found");
      throw new ApiError("No Store found!", 404);
    }

    //return the store
    return store;
  } catch (err: any) {
    logger.error("Error while getting all stores ", {
      error: err.message,
      stack: err.stack,
    });

    // Re-throw known ApiErrors
    if (err instanceof ApiError) {
      throw err;
    }

    // Throw a generic server error for unknown issues
    throw new ApiError(
      "Internal Server Error: An unexpected error occurred during retrieving stores by Id",
      500
    );
  }
};












/**
 * Service to add a rating to a store.
 * @param {RATING} rating - The rating information containing userId, storeId, and rating value.
 * @returns {Promise<IStoreDocument>} - The updated store document with the new rating.
 * @throws {ApiError} - Throws an ApiError if the rating update fails.
 **/
export const addStoreRatingService = async (
  rating: RATING
): Promise<IStoreDocument> => {
  try {
    // fetch the user by ID
    const user = await User.findById(rating.userId);
    if (!user) {
      logger.warn(`User not found: ${rating.userId}`);
      throw new ApiError("User not found", 404);
    }

    // check if the user has already rated this store
    if (user.ratedStores.includes((rating.storeId as unknown as Schema.Types.ObjectId))) {
      logger.warn(
        `User ${rating.userId} has already rated store ${rating.storeId}`
      );
      throw new ApiError("You have already rated this store", 400);
    }

    // fetch the store to be rated
    const store = await Store.findById(rating.storeId);
    if (!store) {
      logger.warn(`Store not found: ${rating.storeId}`);
      throw new ApiError("Store not found", 404);
    }

    // update the store rating
    const newRatingCount = store.rating ? store.rating + 1 : 1;
    store.rating = newRatingCount;

    // save the updated store
    const updatedStore = await store.save();
    if (!updatedStore) {
      logger.error("Store update failed");
      throw new ApiError("Internal server error", 500);
    }

    // update the user's ratedStores array
    user.ratedStores.push((rating.storeId as unknown as Schema.Types.ObjectId));
    await user.save();

    logger.info(
      `Store ${rating.storeId} rated by user ${rating.userId} successfully`
    );
    return updatedStore;
  } catch (error: any) {
    logger.error("Error while adding store rating", {
      error: error.message,
      stack: error.stack,
    });
    if (error instanceof ApiError) throw error;
    throw new ApiError("Internal server error", 500);
  }
};












/**
 * Filters stores based on the given wilaya.
 * @param {string} wilaya - The wilaya to filter stores by.
 * @returns {Promise<IStoreDocument[] | null>} - The list of stores in the specified wilaya, or null if none are found.
 * @throws {ApiError} - Throws an ApiError if there's an issue retrieving the stores.
 */
export const filterStoresService = async (
  wilaya: string
): Promise<IStoreDocument[] | null> => {
  try {
    const stores = await Store.find({ wilaya });

    // return null if there are no stores
    if (!stores || stores.length === 0) {
      return null;
    }

    // return all stores in the specified wilaya
    return stores;
  } catch (err: any) {
    logger.error("Error while retrieving stores by wilaya", {
      error: err.message,
      stack: err.stack,
    });

    // Re-throw known ApiErrors
    if (err instanceof ApiError) {
      throw err;
    }

    // Throw a generic server error for unknown issues
    throw new ApiError(
      `Internal Server Error: An unexpected error occurred while retrieving stores in wilaya: ${wilaya}`,
      500
    );
  }
};












/**
 * Searches for stores based on the provided keywords or description.
 * @param {string | string[]} searchTerm - The term(s) to search for in the store's keywords and description.
 * @returns {Promise<IStoreDocument[]>} - The list of stores that match the search term(s).
 * @throws {ApiError} - Throws an ApiError if there's an issue retrieving the stores.
 */
export const searchStoresService = async (
  searchTerm: string | string[]
): Promise<IStoreDocument[]> => {
  try {
    // convert searchTerm to array if it's a string
    const terms = typeof searchTerm === "string" ? [searchTerm] : searchTerm;

    // search query
    const query = {
      $or: [
        { keywords: { $in: terms.map((term) => new RegExp(term, "i")) } },
        { description: { $regex: new RegExp(terms.join("|"), "i") } },
      ],
    };

    // Find stores that match the query
    const stores = await Store.find(query);

    // Return the found stores
    return stores;
  } catch (err: any) {
    logger.error("Error while searching for stores", {
      error: err.message,
      stack: err.stack,
    });

    // Re-throw known ApiErrors
    if (err instanceof ApiError) {
      throw err;
    }

    // Throw a generic server error for unknown issues
    throw new ApiError(
      `Internal Server Error: An unexpected error occurred during searching for stores with term(s) ${searchTerm}`,
      500
    );
  }
};












/**
 * Searches for stores based on the provided store name.
 * @param {string} storeName - The name of the store to search for.
 * @returns {Promise<IStoreDocument[]>} - The list of stores that match the store name.
 * @throws {ApiError} - Throws an ApiError if there's an issue retrieving the stores.
 */
export const searchStoresByNameService = async (
  storeName: string
): Promise<IStoreDocument[]> => {
  try {
    const query = {
      storeName: { $regex: new RegExp(storeName, "i") }, // Case-insensitive search
    };

    const stores = await Store.find(query);

    return stores;
  } catch (err: any) {
    logger.error("Error while searching for stores by name", {
      error: err.message,
      stack: err.stack,
    });

    // Re-throw known ApiErrors
    if (err instanceof ApiError) {
      throw err;
    }

    // Throw a generic server error for unknown issues
    throw new ApiError(
      `Internal Server Error: An unexpected error occurred during searching for stores with name ${storeName}`,
      500
    );
  }
};















/**
 * updates or add a store logo for a given store.
 *
 * @param {string} storeId - the ID of the store to update.
 * @param {string} userId - the ID of the user making the request.
 * @param {string} filename - the new filename of the store logo.
 * @returns {Promise<IStoreDocument>} - returns the updated store document.
 * @throws {ApiError} - throws an error if the store is not found, the user does not own the store, or an internal error occurs.
 */
export const addStoreLogoOrUpdateService = async (
  storeId: string,
  userId: string,
  filename: string
): Promise<IStoreDocument> => {
  try {
    // chck if the store exists
    const store = await Store.findById(storeId);
    if (!store) throw new ApiError('Store not found!', 404);

    // check if the user owns this store
    if (userId !== store.storeOwner.toString()) {
      throw new ApiError("You cannot change a store's data that you don't own", 401);
    }

    // check if the store already has a logo to delete before adding the new one
    if (store.storeLogo) {
      const filePath = path.join(__dirname, '..', '..', 'uploads', 'logo', store.storeLogo);
      try {
        fs.unlinkSync(filePath);
        logger.info('Old logo deleted successfully');
      } catch (err) {
        throw new ApiError('Error while updating logo', 500);
      }
    }

    // update the store's logo
    store.storeLogo = filename;
    const updatedStore = await store.save();

    // return the updated store document
    return updatedStore;
  } catch (err: any) {
    logger.error('Error while updating store logo', {
      error: err.message,
      stack: err.stack,
    });

    // re-throw known ApiErrors
    if (err instanceof ApiError) {
      throw err;
    }

    // throw a generic server error for unknown issues
    throw new ApiError('Internal Server Error: An unexpected error occurred while updating the store logo', 500);
  }
};