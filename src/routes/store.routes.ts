import express from 'express';
import {
  addNewStoreController,
  updateStoreController,
  deleteStoreController,
  getAllStoresController,
  getStoreByIdController,
  getStoreByNameController,
  addStoreReviewController,
  filterStoresController,
  searchStoresController,
  uploadStoreImageController,
} from '../controllers/store.controller';


import {protect} from '../middleware/checkAuth';
import {allowedTo} from '../middleware/authorization'

import validate from '../middleware/validator';
import * as schema from "../resources-schema/store.schema"

const router = express.Router();





router
    .get("/" , getAllStoresController)
    .get('/:id', validate(schema.getStoreByIdSchema), getStoreByIdController) //endpoint to get a store by Id
    .get('/filter-by-wilaya', validate(schema.filterStoresSchema),filterStoresController) // endpoint to filter stores by wilaya (with query parameter)
    .get('/search',validate(schema.searchStoresSchema) ,searchStoresController) // endpoint to search stores (with query parameter)
    .get('/search-by-name',validate(schema.getStoreByNameSchema), getStoreByNameController); // endpoint to search stores by name (with query parameter)
  




//middlewares
router.use(protect , allowedTo("user"));



//protected routes : 
router
  .post("/" , validate(schema.StoreSchema),  addNewStoreController)
  .put('/:id', validate(schema.UpdateStoreSchema) , updateStoreController) // endpoint to update a store by ID
  .delete('/:id',validate(schema.deleteStoreSchema) , deleteStoreController) // endpoint to delete a store by ID

  .post('/:storeId/images',  uploadStoreImageController) // endpoint to upload a store image by store ID

  .post('/:storeId/reviews', addStoreReviewController) // endpoint to add a review for a store by store ID
  //.delete('/stores/:storeId/reviews/:reviewId', deleteStoreReviewController); // Example of endpoint to delete a store review by review ID

 
export default router;
