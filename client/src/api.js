import axios from "axios";

const api=axios.create({
    baseURL:process.env.VITE_BACKEND_URI,
    withCredentials:true,
    timeout:10000
}
)
export default api