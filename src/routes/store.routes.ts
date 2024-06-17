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

const router = express.Router();


//NEXT : add authentication & authorization middleware 


router
  .post('/stores', addNewStoreController) // endpoint to add a new store
  .put('/stores/:id', updateStoreController) // endpoint to update a store by ID
  .delete('/stores/:id', deleteStoreController) // endpoint to delete a store by ID
  .get('/stores', getAllStoresController) // endpoint to get all stores
  .get('/stores/:id', getStoreByIdController) // endpoint to get a store by ID

  .post('/stores/:storeId/images', uploadStoreImageController) // endpoint to upload a store image by store ID

  .post('/stores/:storeId/reviews', addStoreReviewController) // endpoint to add a review for a store by store ID
  //.delete('/stores/:storeId/reviews/:reviewId', deleteStoreReviewController); // Example of endpoint to delete a store review by review ID

  .get('/stores/filter-by-wilaya', filterStoresController) // endpoint to filter stores by wilaya (with query parameter)
  .get('/stores/search', searchStoresController) // endpoint to search stores (with query parameter)
  .get('/stores/search-by-name', getStoreByNameController); // endpoint to search stores by name (with query parameter)

export default router;
