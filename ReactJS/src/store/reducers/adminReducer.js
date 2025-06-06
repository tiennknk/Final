import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingGender: false,
    genders: [],
    roles: [],
    positions: [],
    users: [],
    topDoctors: [],
    allDoctors: [],
    allScheduleTime: [],
    allRequiredDoctorInfo: [],
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            return {
                ...state,
                isLoadingGender: true,
            };
        case actionTypes.FETCH_GENDER_SUCCESS:
            return {
                ...state,
                genders: action.data,
                isLoadingGender: false,
            };
        case actionTypes.FETCH_GENDER_FAILED:
            return {
                ...state,
                isLoadingGender: false,
                genders: [],
            };
        case actionTypes.FETCH_POSITION_SUCCESS:
            return {
                ...state,
                positions: action.data,
            };
        case actionTypes.FETCH_POSITION_FAILED:
            return {
                ...state,
                positions: [],
            };
        case actionTypes.FETCH_ROLE_SUCCESS:
            return {
                ...state,
                roles: action.data,
            };
        case actionTypes.FETCH_ROLE_FAILED:
            return {
                ...state,
                roles: [],
            };
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            return {
                ...state,
                users: action.users,
            };
        case actionTypes.FETCH_ALL_USERS_FAILED:
            return {
                ...state,
                users: [],
            };
        case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
            return {
                ...state,
                topDoctors: action.dataDoctors,
            };
        case actionTypes.FETCH_TOP_DOCTORS_FAILED:
            return {
                ...state,
                topDoctors: [],
            };
        case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
            return {
                ...state,
                allDoctors: action.dataDr,
            };
        case actionTypes.FETCH_ALL_DOCTORS_FAILED:
            return {
                ...state,
                allDoctors: [],
            };
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
            return {
                ...state,
                allScheduleTime: action.dataTime, // S hoa
            };
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED:
            return {
                ...state,
                allScheduleTime: [], // S hoa
            };
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS:
            return {
                ...state,
                allRequiredDoctorInfo: action.data,
            };
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAILED:
            return {
                ...state,
                allRequiredDoctorInfo: [],
            };
        default:
            return state;
    }
};

export default adminReducer;