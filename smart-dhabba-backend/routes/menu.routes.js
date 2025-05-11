const express = require('express');
const router = express.Router();
const {
    getAllMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
} = require('../controllers/menu.controller');

const { protect, requireRole } = require('../middleware/auth.middleware');

// Public: browse menu
router.get('/', getAllMenuItems);

// Admin-only actions
router.post('/', protect, requireRole('admin'), createMenuItem);
router.put('/:id', protect, requireRole('admin'), updateMenuItem);
router.delete('/:id', protect, requireRole('admin'), deleteMenuItem);

module.exports = router;
