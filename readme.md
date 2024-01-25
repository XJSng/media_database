# RESTful API Documentation

## Introduction

Welcome to the church database RESTful API. This API allows you to perform various operations related to equipment management, livestream services, and volunteer management. The API is built using Node.js with the Express framework and interacts with a MongoDB database.

## Base URL

The base URL for the API will change everytime is it initiated on gitpod.
Also, ensure that the url is public by unlocking the lock icon below:
<img src="image/baseurl.png" width="200" height="100">


## Authentication

Authentication is required for certain routes. You need to include a valid token in the request headers for those routes. The token is obtained through the `/users/login` endpoint, which is handled separately.

## Error Responses

The API returns JSON-formatted error responses with appropriate HTTP status codes. Common error codes include:

- **400 Bad Request:** The request was malformed or missing required fields.
- **401 Unauthorized:** Authentication failed or not provided for a protected endpoint.
- **404 Not Found:** The requested resource was not found.
- **500 Internal Server Error:** An unexpected server error occurred.

## Equipment Endpoints

### 1. Create Equipment

- **Endpoint:** `POST /equipment`
- **Authentication Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "Equipment Name",
    "dateOfPurchase": "YYYY-MM-DD",
    "equipmentType": "Type",
    "modelNumber": "Model Number",
    "generalRemarks": "Remarks",
    "service": "Service"
  }
