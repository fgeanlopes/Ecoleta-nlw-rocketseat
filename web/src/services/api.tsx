import React from 'react'
import axios from 'axios';
import express from "express";
import cors from 'cors';

const app = express();

app.use(cors());


const api = axios.create({
    baseURL:'https://ecoleta-nlw-rocketseat.vercel.app/'
})

export default api;