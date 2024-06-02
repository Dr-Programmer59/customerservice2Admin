  
import axios from 'axios';

const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;

export const addUser = async (data) => {
    try {
        let response = await axios.post(`${url}/add`, data);
        return response.data;
    } catch (error) {
        console.log('Error while calling addUser API ', error);
    }
}

export const getUsers = async () => {
    try {
        let response = await axios.get(`${url}/users`);
        return response.data
    } catch (error) {
        console.log('Error while calling getUsers API ', error);
    }
}

export const createConversation = async (data) => {
    try {
        await axios.post(`${url}/conversation/add`, data);
        console.log("done creating")
    } catch (error) {
        console.log('Error while calling setConversation API ', error);
    }
}

export const getConversation = async (data) => {
    try {
        let response = await axios.post(`${url}/conversation/get`, data);
        console.log("response from get conversation is " ,response)
        return response.data;
    } catch (error) {
        console.log('Error while calling getConversation API ', error);
    }
}


export const addMember = async (data,id) => {
    try {
        console.log("daata we have ")
        let response = await axios.post(`${url}/conversation/addMember/${id}`, data);
        console.log("response from get add member is " ,response)
       
    } catch (error) {
        console.log('Error while calling add member API ', error);
    }
}
export const getAdminConversation = async (users) => {
    try {
        let response = await axios.get(`${url}/conversation/admin/get`, users);
        return response.data;
    } catch (error) {
        console.log('Error while calling getConversation API ', error);
    }
}

export const getMessages = async (id) => {
    try {
        let response = await axios.get(`${url}/message/get/${id}`);
        console.log("the message are ",response.data)
        return response.data
    } catch (error) {
        console.log('Error while calling getMessages API ', error);
    }
}

export const newMessages = async (data) => {
    try {
        return await axios.post(`${url}/message/add`, data);
    } catch (error) {
        console.log('Error while calling newConversations API ', error);
    }
}

export const uploadFile = async (data) => {
    try {
        return await axios.post(`${url}/file/upload`, data);
    } catch (error) {
        console.log('Error while calling newConversations API ', error);
    }
}
export const fetchEmployees = async (data) => {
    try {
        const res=  await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/users`,{ withCredentials: true });
        console.log("Emlpoyees Data is ",res)
        return res.data;

    } catch (error) {
        console.log('Error while calling newConversations API ', error);
    }
}

