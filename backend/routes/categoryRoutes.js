const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  deleteCategory,
  addSubcategory,
  deleteSubcategory,
  updateCategory,
  updateSubcategory
} = require('../controllers/categoryController');

router.post('/', createCategory);
router.get('/', getCategories);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

router.post('/:categoryId/subcategories', addSubcategory);
router.put('/:categoryId/subcategories/:subId', updateSubcategory);
router.delete('/:categoryId/subcategories/:subId', deleteSubcategory);

module.exports = router;
