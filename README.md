# MTSD Course Work

This repository contains coursework for the MTSD (Mequon-Thiensville School District) program, focusing on backend development using NestJS, Prisma ORM, and Docker. The project aims to provide a scalable and maintainable backend architecture suitable for educational applications.



---

## 🚀 Getting Started

### Prerequisites

* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)
* [Node.js](https://nodejs.org/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Zenoviia/MTSD-course-work.git
   cd MTSD-course-work
   ```

---

## 📦 Docker Usage

Docker is used to containerize the application and its dependencies. The `Dockerfile` defines the image for the application, while `docker-compose.yml` manages multi-container Docker applications.

To build and start the application:

```bash
docker-compose up --build
```



To stop the application:([t.me][2])

```bash
docker-compose down
```



For testing purposes:([manchestertwp.org][3])

```bash
docker-compose -f docker-compose.test.yml up --build
```



---

## 🛠️ Local development

For local development, you can run the application without Docker. Ensure you have Node.js and npm installed.

1. Install dependencies:

   ```bash
   npm install
   ```



2. Start the application:

   ```bash
   npm run start
   ```



3. Run tests:([github.com][1])

   ```bash
   npm run test
   ```



