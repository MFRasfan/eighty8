import axios from 'axios';
import { store } from '..';


export const baseURL= 'http://localhost:4000/api'
export const imageURL= 'http://localhost:4000/uploads/'


export const  url={
    login:'auth/login',
    signup:'auth/signup',
    forgetPassword:'auth/forgetPassword',
    resendVerificationCode:'auth/sendVerificationCode',
    resetPassword:'auth/resetPassword',
    refreshAccessToken:'auth/refreshAccessToken',
    verifyAccount:'auth/verifyAccount',
    updateUserById:'user',
    fileUpload:'media/uploads',
    fileDelete:'media/delete',
    role:'role/',
    user:'user/',
    userGain:'user/user-gain',

    inquiry:'inquiry/',
    report:'inquiry/report',
    vehicle:'vehicle',
    notification:'notifications',
    notificationRead:'notifications/read',
    vehicleSearch:'vehicle/search',

    home:'content/home',
    faq:'content/faq',
    contact:'content/contact',
    about:'content/about',
    inquiryGetById:'inquiry/getbyId',
    userGetById:'user/getById',
    createStaff:'auth/registerStaff',
    vehicleFilter:'vehicle/filter',
    getVehicleById:'vehicle/getbyId'
}


export const setAuthToken= token =>{
    if(token){
        axios.defaults.headers.common['Authorization']= `Bearer ${token}`;
    }else{
        delete axios.defaults.headers.common['Authorization']
    }
}

export const makeRequest = async ({method, url, data = null, headers}) => {
    try {

      


      const response = await axios({
        method,
        url:`${baseURL}/${url}`,
        data,
        headers
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };


