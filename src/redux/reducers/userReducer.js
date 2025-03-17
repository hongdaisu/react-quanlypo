import { FETCH_USER_LOGIN, FETCH_USER_SUCCESS, FETCH_USER_ERROR, USER_LOGOUT, USER_REFRESH } from "../actions/userAction";

const INITIAL_STATE = {

    account: {
        username: '',
        password: '',
        firstName: '',
        id: '',
        ky: '',
        use_groupId: '',
        ma_groupId: '',
        phongban_id: '',
        jwt_0: '',
        jwt_1: '',
        jwt_parts_count: '',
        auth: null
    },
    isLoading: false,
    isError: false
};


const userReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case FETCH_USER_LOGIN:

            return {
                ...state,
                isLoading: true,
                isError: false
            };

        case FETCH_USER_SUCCESS:
            // console.log('action s', action.data.jwt)
            return {
                ...state,
                account: {
                    username: action.data.username,
                    password: action.data.password,
                    firstName: action.data.firstName,
                    id: action.data.id,
                    ky: action.data.ky,
                    use_groupId: action.data.use_groupId,
                    ma_groupId: action.data.ma_groupId,
                    phongban_id: action.data.phongban_id,
                    // jwt: action.data.jwt,
                    auth: true,
                },
                isLoading: false,
                isError: false
            };
        case FETCH_USER_ERROR:

            return {
                ...state,
                account: {
                    auth: false,
                },
                isLoading: false,
                isError: true
            };

        case USER_LOGOUT:
            return {
                ...state,
                account: {
                    username: '',
                    password: '',
                    firstName: '',
                    id: '',
                    ky: '',
                    use_groupId: '',
                    ma_groupId: '',
                    phongban_id: '',
                    // jwt_0: '',
                    // jwt_1: '',
                    // jwt_parts_count: '', // Đặt giá trị về ''
                    auth: false,
                },
            };

        case USER_REFRESH:
            // console.log('action r', action)
            return {
                ...state,
                account: {
                    auth: true,
                    username: action.data.username,
                    password: action.data.password,
                    firstName: action.data.firstName.firstName,
                    id: action.data.firstName.id,
                    ky: action.data.firstName.ky,
                    use_groupId: action.data.firstName.use_groupId,
                    ma_groupId: action.data.firstName.ma_groupId,
                    phongban_id: action.data.firstName.phongban_id,
                    // jwt: action.data.firstName.jwt
                }
            };
        default: return state;

    }

};

export default userReducer;