import express from "express";
import homeController from "../controllers/homeController.js";
import userController from "../controllers/userController.js";
import doctorController from "../controllers/doctorController.js";
import patientController from "../controllers/patientController.js";
import specialtyController from "../controllers/specialtyController.js";

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
    // Patient routes
    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-booking', patientController.postVerifyBookingAppointment);

    return app.use("/", router);
};

// BẮT BUỘC phải có export default ở đây
export default initWebRoutes;