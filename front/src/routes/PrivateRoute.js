import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
export const PrivateRoute = ({ allowedRoles }) => {
    const { user } = useAuthStore();
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return _jsx(Navigate, { to: "/products", replace: true });
    }
    return _jsx(Outlet, {});
};
