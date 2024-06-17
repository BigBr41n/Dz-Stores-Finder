import { Request, Response, NextFunction } from "express";
import * as storeService from "../services/store.service";
import { STORE, RATING , AuthRequest } from "../utils/types";
import asyncHandler from "express-async-handler";
import { Types } from "mongoose";







export const addNewStoreController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const id = req.user!.id;
    const storeData: STORE = req.body;
    const newStore = await storeService.addNewStoreService(id, storeData);
    res.status(201).json(newStore);
  }
);








export const updateStoreController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const id = req.user!.id;
    const { storeId } = req.params;
    const storeData: STORE = req.body;
    const updatedStore = await storeService.updateStoreService(
      id,
      storeId,
      storeData
    );
    res.status(200).json(updatedStore);
  }
);





export const deleteStoreController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const id = req.user!.id;
    const { storeId } = req.params;
    await storeService.deleteStoreService(id, storeId);
    res.status(204).send();
  }
);





export const getAllStoresController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const stores = await storeService.getAllStoresService();
    res.status(200).json(stores);
  }
);





export const getStoreByIdController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const store = await storeService.getStoreByIdService(id);
    res.status(200).json(store);
  }
);






export const addStoreReviewController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const ratingData :RATING = {
        storeId : (req.params.storeId as unknown as Types.ObjectId),
        userId : (req.user!.id as unknown as Types.ObjectId),
        rating : req.body,
    }
    const updatedStore = await storeService.addStoreRatingService(ratingData);
    res.status(200).json(updatedStore);
  }
);




export const filterStoresController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { wilaya } = req.params;
    const stores = await storeService.filterStoresService(wilaya);
    res.status(200).json(stores);
  }
);





export const searchStoresController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { searchTerm } = req.query;
  const stores = await storeService.searchStoresService(
    searchTerm as string | string[]
  );
  res.status(200).json(stores);
};




export const getStoreByNameController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { storeName } = req.query;
    const stores = await storeService.searchStoresByNameService(
      storeName as string
    );
    res.status(200).json(stores);
  }
);





export const uploadStoreImageController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.user!;
    const { storeId } = req.params;
    const filename = req.file!.filename;
    const updatedStore = await storeService.addStoreLogoOrUpdateService(
      storeId,
      id,
      filename
    );
    res.status(200).json(updatedStore);
  }
);
