import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
export default function HomePage() {
    return _jsx(Navigate, { to: "/products", replace: true });
}
