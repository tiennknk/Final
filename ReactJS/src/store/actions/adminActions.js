import actionTypes from "./actionTypes";
import { 
    getAllCodeService, 
    createNewUserService, 
    getAllUsers,
    deleteUserService, 
    editUserService,
    getTopDoctorHomeService, 
    getAllDoctors, 
    saveDetailDoctorService,
    getAllSpecialty,
    getAllClinic
} from "../../services/userService";
import { toast } from "react-toastify";

// USER ACTIONS

export const fetchAllUserStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers("ALL");
            if (res && res.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res.users.reverse()))
            } else {
                dispatch(fetchAllUsersFailed());
            }
        } catch (e) {
            dispatch(fetchAllUsersFailed());
            console.log('fetchAllUsersStart error', e)
        }
    }
}

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_GENDER_START
            })
            let res = await getAllCodeService("GENDER");
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data))
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (e) { 
            dispatch(fetchGenderFailed());
            console.log('fetchGenderStart error', e)
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("POSITION");
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data))
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch (e) {
            dispatch(fetchPositionFailed());
            console.log('fetchPositionStart error', e)
        }
    }
}

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("ROLE");
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data))
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (e) {
            dispatch(fetchRoleFailed());
            console.log('fetchRoleStart error', e)
        }
    }
}

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Tạo mới người dùng thành công!");
                dispatch(saveUserSuccess())
                dispatch(fetchAllUserStart());
            } else {
                toast.error("Tạo mới người dùng thất bại!");
                dispatch(saveUserFailed());
            }
            return res;
        } catch (e) {
            dispatch(saveUserFailed());
            return { errCode: -1 };
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})

export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers("ALL");
            if (res && res.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res.users.reverse()))
            } else {
                toast.error("Fetch all users failed!");
                dispatch(fetchAllUsersFailed());
            }
        } catch (e) {
            toast.error("Fetch all users failed!");
            dispatch(fetchAllUsersFailed());
            console.log('fetchAllUsersStart error', e)
        }
    }
}

export const fetchAllUsersSuccess = (userData) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: userData
})

export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED
})

export const deleteUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success("Delete user succeed!");
                dispatch(deleteUserSuccess())
                dispatch(fetchAllUserStart());
            } else {
                toast.error("Delete user failed!");
                dispatch(deleteUserFailed());
            }
            return res;
        } catch (e) {
            toast.error("Delete user failed!");
            dispatch(deleteUserFailed());
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

export const editAUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Update user succeed!");
                dispatch(editUserSuccess())
                dispatch(fetchAllUserStart());
            } else {
                toast.error("Update user failed!");
                dispatch(editUserFailed());
            }
            return res;
        } catch (e) {
            toast.error("Update user failed!");
            dispatch(editUserFailed());
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})

// DOCTOR ACTIONS

export const fetchTopDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService('');
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctors: res.data,
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
            });
        }
    };
};

export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataDr: res.data,
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
            });
        }
    };
}

export const saveDetailDoctor = (data) => {
    
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctorService(data);
            if (res && res.errCode === 0) {
                toast.success("Lưu chi tiết bác sĩ thành công!");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
                });
            } else {
                toast.error("Lưu chi tiết bác sĩ thất bại!");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
                });
            }
            return res;
        } catch (e) {
            toast.error("Lưu chi tiết bác sĩ thất bại!");
            dispatch({
                type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
            });
        }
    };
}

export const fetchAllScheduleTime = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("TIME");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data,
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
            });
        }
    };
}

export const fetchRequiredDoctorInfoSuccess = (data) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS,
    data: data,
});

export const fetchRequiredDoctorInfoFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAILED,
});

export const getAllRequiredDoctorInfo = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_START });
            let resPrice = await getAllCodeService("PRICE");
            let resPayment = await getAllCodeService("PAYMENT");
            let resProvince = await getAllCodeService("PROVINCE");
            let resSpecialty = await getAllSpecialty();
            let resClinic = await getAllClinic();

            if (
                resPrice && resPrice.errCode === 0 &&
                resPayment && resPayment.errCode === 0 &&
                resProvince && resProvince.errCode === 0 &&
                resSpecialty && resSpecialty.errCode === 0 &&
                resClinic && resClinic.errCode === 0
            ) {
                let data = {
                    rePrice: resPrice.data,
                    rePayment: resPayment.data,
                    reProvince: resProvince.data,
                    resSpecialty: resSpecialty.data,
                    resClinic: resClinic.data,
                };
                dispatch(fetchRequiredDoctorInfoSuccess(data));
            } else {
                dispatch(fetchRequiredDoctorInfoFailed());
            }
        } catch (e) {
            dispatch(fetchRequiredDoctorInfoFailed());
            console.log('getAllRequiredDoctorInfo error', e);
        }
    };
}


// ADMIN ACTIONS

export const adminLoginSuccess = (adminInfo) => ({
    type: actionTypes.ADMIN_LOGIN_SUCCESS,
    adminInfo
});

export const adminLoginFail = () => ({
    type: actionTypes.ADMIN_LOGIN_FAIL
});
