import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../axios";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                const response = await axiosInstance.post(`user/logout/blacklist/`, {
                    refresh_token: localStorage.getItem('refresh_token'),
                });
                console.log(response.data);
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
            } finally {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                axiosInstance.defaults.headers['Authorization'] = null;
                navigate('/');
            }
        };

        logout();
    }, [navigate]);

    return null; 
}
