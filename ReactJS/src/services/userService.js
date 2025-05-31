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

export {handleLoginApi, getAllUsers, createNewUserService, editUserService, deleteUserService,
    getAllCodeService, getTopDoctorHomeService, getAllDoctors, saveDetailDoctorService};