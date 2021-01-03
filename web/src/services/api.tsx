import React from 'react'
import axios from 'axios';

const api = axios.create({
    baseURL:'https://ecoleta-nlw-rocketseat.vercel.app/'
})

export default api;