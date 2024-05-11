const express = require('express');
const { addTrain, getTrains, updateTrainSeats} = require('../controllers/trainController');
const {bookSeat, getBookingDetails, cancelBooking}  = require('../controllers/bookingController')
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();


router.post('/admin/train', authenticate, authorize('admin'), addTrain);
router.patch('/admin/train/:trainId', authenticate, authorize('admin'), updateTrainSeats);

router.get('/trains/availability', authenticate, getTrains);
router.post('/book', authenticate, bookSeat);
router.get('/booking/details', authenticate, getBookingDetails);
router.delete('/booking/cancel',authenticate, cancelBooking);

module.exports = router;
