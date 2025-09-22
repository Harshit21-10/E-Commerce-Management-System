# E-commerce Backend with Spring Boot

A robust and scalable backend solution for e-commerce applications built with Spring Boot 3.4.2 and Java 17.

## 🚀 Features

- **Product Management**: CRUD operations for products
- **User Authentication**: Secure user registration and login
- **Order Processing**: Complete order management system
- **Database Integration**: JPA with H2 database (can be configured for other databases)
- **RESTful API**: Clean and well-documented API endpoints
- **File Upload**: Support for product images and other media

## 🛠️ Prerequisites

- Java 17 or higher
- Maven 3.6.3 or higher
- MySQL 8.0 or higher (or H2 for development)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce-backend-springboot-main
   ```

2. **Configure Database**
   - For development with H2 (default): No configuration needed
   - For MySQL: Update `application.properties` with your database credentials

3. **Build the application**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

5. **Access the application**
   - API will be available at: `http://localhost:8080`
   - H2 Console (if enabled): `http://localhost:8080/h2-console`

## 🗄️ Database Schema

The database schema is automatically created on application startup. You can find the SQL file `e-commerce.sql` in the root directory for reference.

## 📚 API Documentation

API documentation is available using Swagger UI:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI docs: `http://localhost:8080/v3/api-docs`

## 🧪 Testing

Run the test suite with:
```bash
mvn test
```

## 🔧 Configuration

Application properties can be configured in `src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080

# H2 Database Configuration (default)
spring.datasource.url=jdbc:h2:mem:ecommercedb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true

# JPA/Hibernate
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect
```

## 📁 Project Structure

```
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ecommerce/flash/
│   │   │       ├── config/         # Configuration classes
│   │   │       ├── controller/     # REST controllers
│   │   │       ├── model/          # Entity classes
│   │   │       ├── repository/     # Data access layer
│   │   │       ├── service/        # Business logic
│   │   │       └── EcommerceApplication.java
│   │   └── resources/
│   │       ├── static/            # Static resources
│   │       ├── templates/         # Template files
│   │       └── application.properties
│   └── test/                      # Test files
└── pom.xml
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot Team
- Open-source community contributors
