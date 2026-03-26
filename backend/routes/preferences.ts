import express from 'express';
import {
  getPreferences,
  updatePreferences,
  resetPreferences,
} from '../controllers/preferencesController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/', getPreferences);
router.put('/', updatePreferences);
router.post('/reset', resetPreferences);

export default router;
