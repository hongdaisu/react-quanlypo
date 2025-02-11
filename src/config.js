// export default {
//     api: {
//         //API_BASE_URL: "http://dn-qlpo.fhmc.com:8086/",
//         API_BASE_URL: "http://qlpo.local:8086/",
//         //API_BASE_URL: "http://10.22.22.1:8084/",
//         ROUTER_BASE_NAME: null,
//     },
//     app: {
//         /**
//          * The base URL for all locations. If your app is served from a sub-directory on your server, you'll want to set
//          * this to the sub-directory. A properly formatted basename should have a leading slash, but no trailing slash.
//          */
//         ROUTER_BASE_NAME: null,
//     }
// };


export default {
    api: {
        API_BASE_URL: window.location.protocol === 'https:'
            ? process.env.REACT_APP_BACKEND_URL_HTTPS
            : process.env.REACT_APP_BACKEND_URL,
        ROUTER_BASE_NAME: null,
    },
    app: {
        ROUTER_BASE_NAME: null,
    }
};
