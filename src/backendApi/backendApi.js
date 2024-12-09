import axios from 'axios';

const backendApi = axios.create({
  baseURL: 'http://localhost:8080'
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