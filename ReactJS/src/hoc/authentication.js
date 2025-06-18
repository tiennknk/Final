import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";

const locationHelper = locationHelperBuilder({});

export const userIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectPath: '/login'
});

export const userIsNotAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => !state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsNotAuthenticated',
    redirectPath: (state, ownProps) => {
        // Nếu user đã login, không cho vào trang login/register nữa, redirect về /home (hoặc trang nào bạn muốn)
        // locationHelper.getRedirectQueryParam(ownProps) chỉ dùng cho redirect lại sau khi login, nhưng nếu đã login thì nên về home
        return '/home';
    },
    allowRedirectBack: false
});