const express = require('express');
const router = express.Router();
const {
    createGroup,
    getMyGroups,
    updateGroup,
    deleteGroup,
    manageMembers,
    toggleBillingAcceptance,
    calculateSplit
} = require('../controllers/group.controller');

const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createGroup);
router.get('/', protect, getMyGroups);
router.put('/:groupId', protect, updateGroup);
router.delete('/:groupId', protect, deleteGroup);
router.post('/:groupId/manage', protect, manageMembers);
router.post('/:groupId/toggle-accept', protect, toggleBillingAcceptance);
router.get('/:groupId/split', protect, calculateSplit);

module.exports = router;
