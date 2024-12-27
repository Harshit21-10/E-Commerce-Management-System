# E-Commerce Management System

## Overview
The **E-Commerce Management System** is a Spring Boot-based application that provides APIs to manage products in an e-commerce platform. The system supports functionalities such as adding, updating, deleting, retrieving, and searching for products, along with managing product images.

## Features
- **Product Management**:
  - Add new products with details such as name, description, brand, price, category, etc.
  - Update product details.
  - Delete products.
  - Retrieve all products or a single product by ID.
- **Image Management**:
  - Upload and retrieve product images.
  - Store images as binary data in the database.
- **Search Functionality**:
  - Search products by keyword in name, description, brand, or category.

## Technology Stack
- **Backend**: Java, Spring Boot, Hibernate
- **Database**: H2 (in-memory database, configurable to other databases like MySQL or PostgreSQL)
- **Build Tool**: Maven
- **Dependencies**:
  - Spring Boot Starter Web
  - Spring Boot Starter Data JPA
  - Jackson Databind
  - Lombok

## Prerequisites
- Java 17 or higher
- Maven 3.6+

## Project Structure
```
|-- src/main/java/com/harshit/e_commerce
    |-- Controller
        |-- ProductController.java
    |-- Model
        |-- Products.java
    |-- Service
        |-- ProductService.java
    |-- repository
        |-- ProductRepo.java
|-- src/main/resources
    |-- application.properties
```

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd e-commerce
   ```

2. Build the project using Maven:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

4. The application will be accessible at `http://localhost:8080/start/`.

## API Endpoints

### Base URL: `/start`

#### 1. Greet API
- **Endpoint**: `/`
- **Method**: GET
- **Description**: Returns a simple greeting.
- **Response**:
  ```json
  "Hello world"
  ```

#### 2. Get All Products
- **Endpoint**: `/products`
- **Method**: GET
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "Product 1",
      "description": "Description of Product 1",
      "brand": "Brand A",
      "price": 100.0,
      "category": "Electronics",
      "releaseDate": "2023-12-01",
      "available": true,
      "quantity": 10
    }
  ]
  ```

#### 3. Get Product by ID
- **Endpoint**: `/products/{id}`
- **Method**: GET
- **Description**: Retrieves a product by its ID.

#### 4. Add a Product
- **Endpoint**: `/product`
- **Method**: POST
- **Request Body**:
  - Product details in JSON.
  - Image file as `multipart/form-data`.
- **Response**:
  ```json
  {
    "id": 1,
    "name": "Product 1",
    "imageName": "image.jpg",
    "imageType": "image/jpeg"
  }
  ```

#### 5. Update a Product
- **Endpoint**: `/product/{id}`
- **Method**: PUT
- **Request Body**:
  - Updated product details in JSON.
  - Image file as `multipart/form-data`.

#### 6. Delete a Product
- **Endpoint**: `/product/{id}`
- **Method**: DELETE
- **Response**:
  ```json
  "Deleted"
  ```

#### 7. Search Products
- **Endpoint**: `/products/search`
- **Method**: GET
- **Query Parameter**: `keyword`
- **Description**: Searches for products by a keyword in name, description, brand, or category.

## Database Schema

### Products Table
| Field        | Type        | Description                      |
|--------------|-------------|----------------------------------|
| id           | Long        | Unique identifier for a product |
| name         | String      | Name of the product             |
| description  | String      | Product description             |
| brand        | String      | Brand of the product            |
| price        | BigDecimal  | Price of the product            |
| category     | String      | Category of the product         |
| releaseDate  | LocalDate   | Release date of the product     |
| available    | Boolean     | Availability status             |
| quantity     | Integer     | Quantity in stock               |
| imageName    | String      | Image file name                 |
| imageType    | String      | MIME type of the image          |
| imageData    | byte[]      | Binary data for the image       |


## Future Enhancements
- Add authentication and authorization.
- Implement pagination and sorting for product listing.
- Extend search functionality with more filters (price range, availability, etc.).


