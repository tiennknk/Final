import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import homeController from "../controllers/homeController.js";
import adminController from "../controllers/adminController.js";
import userController from "../controllers/userController.js";
import doctorController from "../controllers/doctorController.js";
import patientController from "../controllers/patientController.js";
import specialtyController from "../controllers/specialtyController.js";
import clinicController from "../controllers/clinicController.js";
import reviewController from "../controllers/reviewcontroller.js";

const router = express.Router();

const initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    // User routes
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);
    
    // Doctor routes
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/save-info-doctor', doctorController.postInfoDoctor);
    router.post('/api/bulk-create-schedule', doctorController.saveBulkScheduleDoctor);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-info-doctor-by-id', doctorController.getExtraInfoDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    router.post('/api/create-new-specialty', specialtyController.createNewSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);
    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinic); 
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);
    router.get('/api/get-booked-time-type-by-date', doctorController.getBookedTimeTypesByDate);
    router.get('/api/get-history-patients-by-doctor', doctorController.getHistoryPatientsByDoctor);
    router.post('/api/cancel-booking', doctorController.cancelBooking);
    router.delete('/api/delete-schedule-slot', doctorController.deleteScheduleSlot);
    router.post('/api/send-remedy', doctorController.sendRemedy);
    router.post('/api/doctor/confirm-payment-cash', doctorController.confirmPaymentCash);
    router.post('/api/doctor/confirm-qr-payment', doctorController.confirmQrPaymentStatus);

    // Patient routes
    router.post('/api/patient-book-appointment', authenticateToken, patientController.postBookAppointment);
    router.post('/api/verify-booking', patientController.postVerifyBookingAppointment);
    router.get('/api/patient-profile', patientController.getPatientProfile);
    router.put('/api/update-patient-profile', patientController.updatePatientProfile);
    router.get('/api/patient-history', patientController.getPatientHistory);
    router.post('/api/create-review', reviewController.createReview);
    router.get('/api/get-all-reviews', reviewController.getAllReviews);

    // Admin routes
    router.post('/api/admin/clinic-confirm-payment', authenticateToken, adminController.clinicConfirmPayment);
    router.get('/api/get-bookings-wait-confirm', authenticateToken, adminController.getBookingsWaitConfirm);
    router.get('/api/get-all-bookings', authenticateToken, adminController.getAllBookings);
    router.post('/api/patient-confirm-payment', authenticateToken, adminController.confirmPayment);
    
    return app.use("/", router);
};

// BẮT BUỘC phải có export default ở đây
export default initWebRoutes;