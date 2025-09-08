import { Outlet, Navigate } from 'react-router-dom';
const ProtectedComponents = ({ isLoggedIn }) => {
    const user = localStorage.getItem("loggedUser");
    if (isLoggedIn || user) {
        return (<Outlet />)
    } else {
        return <Navigate to="/" />;
    }
}
export default ProtectedComponents
