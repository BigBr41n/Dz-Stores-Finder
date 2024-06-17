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

const router = express.Router();



//middlewares
router.use(protect , allowedTo("user"));


router.route("/").get(getAllStoresController).post(addNewStoreController)

router
  .put('/:id', updateStoreController) // endpoint to update a store by ID
  .delete('/:id', deleteStoreController) // endpoint to delete a store by ID
  .get('/:id', getStoreByIdController) // endpoint to get a store by ID

  .post('/:storeId/images', uploadStoreImageController) // endpoint to upload a store image by store ID

  .post('/:storeId/reviews', addStoreReviewController) // endpoint to add a review for a store by store ID
  //.delete('/stores/:storeId/reviews/:reviewId', deleteStoreReviewController); // Example of endpoint to delete a store review by review ID

  .get('/filter-by-wilaya', filterStoresController) // endpoint to filter stores by wilaya (with query parameter)
  .get('/search', searchStoresController) // endpoint to search stores (with query parameter)
  .get('/search-by-name', getStoreByNameController); // endpoint to search stores by name (with query parameter)

export default router;
