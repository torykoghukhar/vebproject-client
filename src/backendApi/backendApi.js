import axios from 'axios';

const backendApi = axios.create({
  baseURL: 'https://vebproject-server-production.up.railway.app'
});

backendApi.interceptors.request.use((confirg)=>{
  const token = localStorage.getItem('token');
  if(token){
      confirg.headers['Authorization'] = `Bearer ${token}`;
  }
  return confirg;
},(error) => {
  return Promise.reject(error);
});

export default backendApi;
