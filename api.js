/*
    API CONNECTION LAYER
    --------------------

    All communication between the frontend
    and backend goes through this file.

    Backend API version:
    /api/v1

    The backend URL can be changed later
    without modifying the other JS files.
*/


const API_BASE_URL = "http://localhost:3000/api/v1";


/*
    Generic API request function
*/

async function apiRequest(endpoint, options = {}) {

    try {

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,

                headers: {
                    "Content-Type": "application/json",

                    ...(options.headers || {})
                }
            }
        );


        /*
            Handle HTTP errors
        */

        if (!response.ok) {

            throw new Error(
                `API request failed: ${response.status}`
            );

        }


        /*
            Convert response to JSON
        */

        const data = await response.json();

        return data;

    } catch (error) {

        console.error(
            "API Error:",
            error
        );

        throw error;

    }

}


/*
    GET request
*/

async function apiGet(endpoint) {

    return await apiRequest(
        endpoint,
        {
            method: "GET"
        }
    );

}


/*
    POST request
*/

async function apiPost(endpoint, data) {

    return await apiRequest(
        endpoint,
        {
            method: "POST",

            body: JSON.stringify(data)
        }
    );

}


/*
    PATCH request
*/

async function apiPatch(endpoint, data) {

    return await apiRequest(
        endpoint,
        {
            method: "PATCH",

            body: JSON.stringify(data)
        }
    );

}