import * as api from '../api/index'

export const verifyDoctor = (user) => async (dispatch)=>{
    try {
        console.log('success user :' , user)
      const {data} = await api.verifyDoctor(user);
      
      console.log('returnnnnnnn', data) 
      window.localStorage.setItem("doctorId", data.doctorId);
      window.localStorage.setItem("doctorName", data.doctorName);
      dispatch({type :'verifyDoctor' , payload: data})

      dispatch(AuthDoctor(data))

      window.location = "/doctorProfile/" + `${window.localStorage.doctorId}`;
    }
    catch(error){
        console.log('failed')
        console.log(error)
    }
 
}

export const AuthDoctor = (authInputs) => async(dispatch) => {
    try {
        console.log('success to auth :', authInputs)
        const { data } = await api.AuthDoctor(authInputs);

        console.log(data, 'returnnnnnnn from auth ')
        dispatch({ type: 'AuthDoctor', payload: data })
        window.localStorage.setItem("token", data);
        console.log("daaaaaaattttttaaaa", data)
        
    }
    catch (error) {
        console.log('failed to Auth')
        console.log(error)
    }

}

