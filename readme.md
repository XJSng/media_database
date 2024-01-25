# RESTful API Documentation

## Introduction

Welcome to the church database RESTful API. This API allows you to perform various operations related to equipment management, livestream services, and volunteer management. The API is built using Node.js with the Express framework and interacts with a MongoDB database.

## Base URL

The base URL for the API will change everytime is it initiated on gitpod.
Also, ensure that the url is public by unlocking the lock icon below:
![base url image](/images/baseurl.png)


## Authentication

Authentication is required for certain routes. You need to include a valid token in the request headers for those routes.

To register a user pass the email and password to the `/user` route
  ```json
  {
    "email": "user@email.com",
    "password": "password_of_your_choice",
  }
```

 To obtain a token use the `/users/login` endpoint with a registered email and password
 ![login image](/images/login.png)
 ![authorisation image](/images/authorisation.png)

Error Responses

The API returns JSON-formatted error responses with appropriate HTTP status codes. Error codes include:
- **400 Bad Request:** The request was malformed or missing required fields.
- **401 Unauthorized:** Authentication failed or not provided for a protected endpoint.
- **404 Not Found:** The requested resource was not found.
- **500 Internal Server Error:** An unexpected server error occurred.

## Demo Equipment Endpoints `/equipment`

### 1. GET Equipment
- **Endpoint:** `GET /equipment`
- **Authentication Required:** No
- **Request Body:** No

- **GET Example**
 ![GET equipment example ](/images/get_equipment_example.png)

### 2. POST Equipment
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
    "service": {
        "service-status": "not-serviced",
        "last-service-date": "YYYY-MM-DD",
        "service-remarks": "Remarks"
    }
  }
  ```

- **POST Example**
![POST equipment example](/images/post_equipment_example.png)


### 3. PUT Equipment
- **Endpoint:** `PUT /equipment/equipmentId`
- **Authentication Required:** Yes
- **Request Body:**

Using the `GET /equipment`, you would be able to get the equipment id you wouldl ike to update. From there extend the url rotue with `equipment/equipmentId`

  ```json
{
  "name": "Updated equipment Name",
  "dateOfPurchase": "YYYY-MM-DD",
  "equipmentType": "Updated type",
  "modelNumber": "Updated model number",
  "generalRemarks": "Updated remarks",
  "service": {
      "service-status": "serviced",
      "last-service-date": "YYYY-MM-DD",
      "service-remarks": "Updated remarks"
  }
}
  ```

- **PUT Example**
![PUT equipment example](/images/put_equipment_example.png)

### 4. DELETE Equipment
- **Endpoint:** `DELETE /equipment/equipmentId`
- **Authentication Required:** Yes
- **Request Body:**

Using the `GET /equipment`, you would be able to get the equipment id you wouldl ike to update. From there extend the url rotue with `equipment/equipmentId`


- **DELETE Example**
![DELETE equipment example](/images/delete_equipment_example.png)


# For the other routes
I'll walkthrough only the GET and POST method for the other two routes (`/volunteers` & `/livestream`). The PUT and DELETE methods are similar by using the `/GET` method to reference the ID.

## Demo volunteers Endpoints `/volunteers`
### 1. GET volunteer
- **Endpoint:** `GET /volunteer`
- **Authentication Required:** No
- **Request Body:** No

- **GET Example**
 ![GET volunteer example ](/images/get_volunteer_example.png)

 ### 2. POST volunteer
- **Endpoint:** `POST /volunteer`
- **Authentication Required:** Yes
- **Request Body:**
  ```json
  {
    "name":"Carrot Tan",
  "dob": "2000/01/01",
  "email":"carrottan@gmail.com",
  "phoneNumber":"88776655"
  }
  ```

- **POST Example**
![POST equipment example](/images/post_volunteer_example.png)

## Demo volunteers Endpoints `/livestream`
### 1. GET livestream
- **Endpoint:** `GET /livestream`
- **Authentication Required:** No
- **Request Body:** No

- **GET Example**
 ![GET livestream example ](/images/get_livestream_example.png)

 ### 2. POST livestream
- **Endpoint:** `POST /livestream`
- **Authentication Required:** Yes
- **Request Body:**
  ```json
  "director":"65a5fe0ae4af74088a93b8ac",
  "volunteers":["75a63a022503b928b30ebe1c",
                "75a63abc2503b928b30ebe1d",
                "75a639d92503b928b30ebe1b",
                "75a639862503b928b30ebe19",
                "75a638fe2503b928b30ebe17",
                "75a615fb6c16377ddd480efe"],
  "livestreamDate":"2024/01/14",
  "equipmentList":[
                "75a60f1f6c16377dcd370ef8",
                "75a610126c16377dcd370ef9",
                "75a610956c16377dcd370efa",
                "75a611086c16377dcd370efb"]

  ```
  - NOTE: The equipments and volunteers can be referenced from the `GET /equipment` and `GET /volunteer` respectively
  - The IDs above are modified for data security

- **POST Example**
![POST equipment example](/images/post_livestream_example.png)