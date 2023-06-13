import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: "http://localhost:5000",
  });
//security layer: verifyJwt , same email, check admin
//5
const useAxiosSecure = () => {
  const { logOut } = useAuth(AuthContext);

  const navigate = useNavigate();



  useEffect(() => {
    axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem('access-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          await logOut();
          navigate('/login');
        }

        return Promise.reject(error);
      }
    );
  }, [logOut, navigate]);
  return [axiosSecure];
};

export default useAxiosSecure;