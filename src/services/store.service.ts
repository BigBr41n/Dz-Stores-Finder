import Store from "../models/store.model";
import { STORE } from "../utils/types";
import { ApiError } from "../utils/apiError";
import logger from "../utils/logger";
import { IStoreDocument } from "../models/store.model";






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
      storeOwner: userId,                   //the user id of the logged in user , that got from middleware
      wilaya: storeData.wilaya,
      city: storeData.city,
      longitude: storeData.longitude,
      latitude: storeData.latitude,
      storeType: storeData.storeType,
    });


    //if the store didn't created successfully
    if (!newStore){
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

    if (err instanceof ApiError) throw err;
    throw new ApiError("Internal server Error", 500);
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
