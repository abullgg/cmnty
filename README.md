# Cmnty Backend

A secure, scalable REST API built to manage community events, clubs, and transactional user registrations. The architecture emphasizes data integrity, clean error handling, and robust stateless authentication.

## Core Architecture & Features

* **Java Spring Boot REST API**
  Developed utilizing a strict N-tier architecture (Controllers, Services, Repositories). DTOs separate raw database entities from the front-facing API boundaries.

* **Spring Security + JWT Authentication**
  Stateless session management implemented using JSON Web Tokens (JWT). All endpoints (outside of registry/login) are secured behind a custom `OncePerRequestFilter` that intercepts and validates claims.

* **BCrypt Password Hashing**
  Raw credentials are never stored in plain text. Spring Security's `BCryptPasswordEncoder` handles salt generation and key-stretching to prevent brute-force and rainbow table attacks.

* **Role-Based Access Control**
  Extensive business logic protects resources at the service layer. Users can only access registration lists or modify metadata for events they explicitly host, returning standard HTTP 403 Forbidden exceptions upon violation.

* **Transactional Registration with Capacity Enforcement**
  Crucial methods such as event registration are wrapped via `@Transactional` to lock database rows against overlapping concurrent requests, ensuring strict capacity limit enforcement.

* **Paginated Event Discovery with Filtering**
  Utilizes Spring Data JPA `Pageable` constructs. Event queries can be dynamically filtered by city bindings and precise ISO date-ranges while chunking responses to limit memory footprints.

* **PostgreSQL Persistent Database**
  Migrated away from in-memory constraints. Relies on Hibernate/JPA auto-DDL to map relational objects (ManyToOne/OneToMany) to a robust, local PostgreSQL database instance.

* **Global Exception Handling**
  A centralized `@RestControllerAdvice` intercepts all domain-level exceptions (`ResourceNotFoundException`, `AlreadyRegisteredException`, etc.) and translates them into uniform, developer-friendly JSON maps attached to proper HTTP status codes (404, 409, 403, 500).

## Tech Stack

* **Language**: Java 17
* **Framework**: Spring Boot 3.x
* **Security**: Spring Security 6, JJWT (io.jsonwebtoken)
* **Persistence**: Spring Data JPA, Hibernate
* **Database**: PostgreSQL
* **Build Tool**: Maven (`mvnw`)
* **Testing**: JUnit 5, Mockito

## Local Development

### Prerequisites
* JDK 17
* PostgreSQL running locally on port 5432

### Setup
1. Create a PostgreSQL database named `cmnty_db` owned by the default `postgres` user.
2. Clone the repository and navigate to the backend directory.
3. Run the application using the Maven wrapper:

```bash
cd cmntybackend
./mvnw spring-boot:run
```

Hibernate will automatically generate the required database tables (`users`, `clubs`, `events`, `registrations`) on startup.
