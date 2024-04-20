const express = require('express');
const { addTrain, getTrains} = require('../controllers/trainController');
const {bookSeat, getBookingDetails}  = require('../controllers/bookingController')
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();


router.post('/admin/train', authenticate, authorize('admin'), addTrain);
router.get('/trains/availability', authenticate, getTrains);
router.post('/book', authenticate, bookSeat);
router.get('/booking/details', authenticate, getBookingDetails);

module.exports = router;
