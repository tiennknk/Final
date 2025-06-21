import axios from '../axios';

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', {email: userEmail, password: userPassword});
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}

const createNewUserService = (data) => {
    console.log('check data from service', data);
    return axios.post('/api/create-new-user', data);
}

const editUserService = (inputData) => {
    return axios.put('api/edit-user' , inputData);
}

const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: { id: userId }
    });
}

const getAllCodeService = (inputData) => {
    return axios.get(`/api/allcode?type=${inputData}`)
}

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
}

const getAllDoctors = () => {
    return axios.get('/api/get-all-doctors');
}

const saveDetailDoctorService = (data) => {
    return axios.post('/api/save-info-doctor', data);
}

const getDetailInfoDoctor = (id) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${id}`);
}

const saveBulkScheduleDoctor = (data) => {
    return axios.post('/api/bulk-create-schedule', data);
}

const getScheduleByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`);
}

const getBookedTimeTypesByDate = (doctorId, date) => {
    return axios.get(`/api/get-booked-time-type-by-date?doctorId=${doctorId}&date=${date}`);
}

const getExtraInfoDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-info-doctor-by-id?doctorId=${doctorId}`);
}

const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
}

const postBookAppointment = (data) => {
    return axios.post('/api/patient-book-appointment', data);
}

const postVerifyBookingAppointment = (data) => {
    return axios.post('/api/verify-booking', data);
}

const createNewSpecialty = (data) => {
    return axios.post('/api/create-new-specialty', data);
}

const getAllSpecialty = (type) => {
    return axios.get(`/api/get-all-specialty?type=${type}`);
};

const getDetailSpecialtyById = (id, location) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${id}&location=${location}`);
};

const createNewClinic = (data) => {
    return axios.post('/api/create-new-clinic', data);
}

const getAllClinic = () => {
    return axios.get('/api/get-all-clinic');
}

const getDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
}

const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`);
};

const postSendRemedy = (data) => {
    return axios.post('/api/send-remedy', data);
};

const getHistoryPatientsByDoctor = (doctorId) => {
    let url = `/api/get-history-patients-by-doctor?doctorId=${doctorId}`;
    return axios.get(url).then(res => res.data);
};

const cancelBooking = (bookingId) => {
    return axios.post('/api/cancel-booking', { bookingId });
};

const getPatientProfile = (patientId) => {
    return axios.get(`/api/patient-profile?patientId=${patientId}`);
}

const updatePatientProfile = (data) => {
    return axios.put('/api/update-patient-profile', data);
}

const getPatientHistory = (patientId) => {
    return axios.get(`/api/patient-history?patientId=${patientId}`);
};

const createReviewService = (data) => {
    return axios.post('/api/create-review', data);
}

const getAllReviewsService = ({ doctorId, clinicId } = {}) => {
    let query = [];
    if (doctorId !== undefined && doctorId !== null) query.push(`doctorId=${doctorId}`);
    if (clinicId !== undefined && clinicId !== null) query.push(`clinicId=${clinicId}`);
    let queryString = query.length ? '?' + query.join('&') : '';
    const url = `/api/get-all-reviews${queryString}`;
    return axios.get(url)
        .then(res => {
            return res;
        })
        .catch(error => {
            throw error;
        });
};

const deleteScheduleSlot = (doctorId, date, timeType) => {
    return axios.delete('/api/delete-schedule-slot', { data: { doctorId, date, timeType } });
};

export {
    handleLoginApi,
    getAllUsers,
    createNewUserService,
    editUserService,
    deleteUserService,
    getAllCodeService,
    getTopDoctorHomeService,
    getAllDoctors,
    saveDetailDoctorService,
    getDetailInfoDoctor,
    saveBulkScheduleDoctor,
    getScheduleByDate,
    getBookedTimeTypesByDate,
    getExtraInfoDoctorById,
    getProfileDoctorById,
    postBookAppointment,
    postVerifyBookingAppointment,
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    createNewClinic,
    getDetailClinicById,
    getAllClinic,
    getAllPatientForDoctor,
    getHistoryPatientsByDoctor,
    cancelBooking,
    postSendRemedy,
    getPatientProfile,
    updatePatientProfile,
    getPatientHistory,
    createReviewService,
    getAllReviewsService,
    deleteScheduleSlot,
};