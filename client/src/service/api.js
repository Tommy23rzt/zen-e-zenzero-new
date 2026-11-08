import axios from 'axios';

import { API_NOTIFICATION_MESSAGES, SERVICE_URLS } from '../constants/config';
import { getAccessToken, getType } from '../utils/common-utils';

const API_URL = process.env.REACT_APP_API_URL || 'https://zen-e-zenzero-server.onrender.com';

const axiosInstance = axios.create({
    baseURL: API_URL,
    // Render free tier can take 30-60s to wake up from sleep, so a 10s timeout
    // would abort the request before the server is up.
    timeout: 60000,
    headers: {
        "content-type": "application/json"
    }
});

// Errors worth retrying: no response at all (network / timeout) or a gateway
// error returned by Render while the instance is still booting.
const isRetryableError = (error) =>
    !error.response || [502, 503, 504].includes(error.response.status);

const RETRY_DELAYS = [5000, 10000, 15000]; // only for GET requests

axiosInstance.interceptors.request.use(
    function(config) {
        // Avoid re-applying params/query when the request is retried.
        if (!config.__prepared) {
            if (config.TYPE.params) {
                config.params = config.TYPE.params
            } else if (config.TYPE.query) {
                config.url = config.url + '/' + config.TYPE.query;
            }
            config.__prepared = true;
        }
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function(response) {
        // Stop global loader here
        return processResponse(response);
    },
    async function(error) {
        // Stop global loader here
        const config = error.config || {};
        const method = (config.method || 'get').toLowerCase();
        const retryCount = config.__retryCount || 0;

        // Retry only idempotent GET requests, to avoid duplicating writes.
        if (method === 'get' && isRetryableError(error) && retryCount < RETRY_DELAYS.length) {
            config.__retryCount = retryCount + 1;
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[retryCount]));
            return axiosInstance(config);
        }

        return Promise.reject(ProcessError(error));
    }
)

///////////////////////////////
// If success -> returns { isSuccess: true, data: object }
// If fail -> returns { isFailure: true, status: string, msg: string, code: int }
//////////////////////////////
const processResponse = (response) => {
    if (response?.status === 200) {
        return { isSuccess: true, data: response.data }
    } else {
        return {
            isFailure: true,
            status: response?.status,
            msg: response?.msg,
            code: response?.code
        }
    }
}

///////////////////////////////
// If success -> returns { isSuccess: true, data: object }
// If fail -> returns { isError: true, status: string, msg: string, code: int }
//////////////////////////////
const ProcessError = async (error) => {
    if (error.response) {
        // Request made and server responded with a status code 
        // that falls out of the range of 2xx
        if (error.response?.status === 403) {
            // const { url, config } = error.response;
            // console.log(error);
            // try {
            //     let response = await API.getRefreshToken({ token: getRefreshToken() });
            //     if (response.isSuccess) {
                    sessionStorage.clear();
            //         setAccessToken(response.data.accessToken);

            //         const requestData = error.toJSON();

            //         let response1 = await axios({
            //             method: requestData.config.method,
            //             url: requestData.config.baseURL + requestData.config.url,
            //             headers: { "content-type": "application/json", "authorization": getAccessToken() },
            //             params: requestData.config.params
            //         });
            //     }
            // } catch (error) {
            //     return Promise.reject(error)
            // }
        } else {
            console.log("ERROR IN RESPONSE: ", error.toJSON());
            return {
                isError: true,
                msg: API_NOTIFICATION_MESSAGES.responseFailure,
                code: error.response.status
            }
        }
    } else if (error.request) { 
        // The request was made but no response was received
        console.log("ERROR IN RESPONSE: ", error.toJSON());
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.requestFailure,
            code: ""
        }
    } else { 
        // Something happened in setting up the request that triggered an Error
        console.log("ERROR IN RESPONSE: ", error.toJSON());
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.networkError,
            code: ""
        }
    }
}

const API = {};

for (const [key, value] of Object.entries(SERVICE_URLS)) {
    API[key] = (body, showUploadProgress, showDownloadProgress) =>
        axiosInstance({
            method: value.method,
            url: value.url,
            data: value.method === 'DELETE' ? {} : body,
            responseType: value.responseType,
            headers: {
                authorization: getAccessToken(),
            },
            TYPE: getType(value, body),
            onUploadProgress: function(progressEvent) {
                if (showUploadProgress) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    showUploadProgress(percentCompleted);
                }
            },
            onDownloadProgress: function(progressEvent) {
                if (showDownloadProgress) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    showDownloadProgress(percentCompleted);
                }
            }
        });
}

export { API };