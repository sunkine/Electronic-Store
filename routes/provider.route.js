import express from "express";
import { getAllProviders, createProvider, updateProviderByID, deleteProviderByID, getProvider, listProviderSearch } from '../controllers/provider.class.js';

const router = express.Router();

router.get('/:id', getProvider);
router.get('/', getAllProviders);
router.post('/', createProvider); 
router.put('/:id', updateProviderByID);
router.delete('/:id', deleteProviderByID);
router.post('/search', listProviderSearch);

export default router;
