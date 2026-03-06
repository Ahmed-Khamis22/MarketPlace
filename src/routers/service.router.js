const router = require('express').Router();
const { createService , deleteService , updateService , getServiceById , getAllServices } = require('../controllers/service.controller');
const auth = require('../middlewares/authMiddleWare');
const upload = require('../middlewares/upload');
const authorize = require('../middlewares/Authorize');

router.post('/', auth, authorize , upload.single('image'), createService);
router.get('/', auth, getAllServices);
router.get('/:serviceId', auth, getServiceById);
router.put('/:serviceId', auth, authorize, upload.single('image'), updateService);
router.delete('/:serviceId', auth, authorize, deleteService);

module.exports = router;