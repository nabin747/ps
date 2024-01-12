import axios from "axios";

// var baseURL = "https://jsonplaceholder.typicode.com";
var baseURL = "http://127.0.0.1:8000/";
// var domain = process.env.VUE_APP_HOST_NAME ?? window.location.hostname;

axios.defaults.baseURL = baseURL;
// axios.defaults.headers.common["domain"] = domain;
