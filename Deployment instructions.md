# Smart-Dhaba Deployment Instructions

This document provides comprehensive instructions for deploying the Smart-Dhaba application in both development and production environments.

## Prerequisites

- Node.js (v14+ recommended)
- MongoDB (v4.4+ recommended)
- Docker and Docker Compose
- Git
- npm or yarn

## Development Setup

### Backend Setup

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd Smart-Dhaba-microservice/smart-dhabba-backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create `.env` files for each microservice in their respective directories:

   For main backend:

   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/smart-dhaba
   JWT_SECRET=your_jwt_secret
   ```

   For auth-service:

   ```
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/smart-dhaba
   JWT_SECRET=your_jwt_secret
   ```

   For order-service:

   ```
   PORT=3002
   MONGO_URI=mongodb://localhost:27017/smart-dhaba
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to the frontend directory**:

   ```bash
   cd ../smart-dhabba-frontend/smart-dhabba
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file:

   ```
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## Docker Deployment

### Using Docker Compose

1. **Build and start the containers**:

   ```bash
   cd Smart-Dhaba-microservice/smart-dhabba-backend
   docker-compose up -d
   ```

   This will start:

   - MongoDB container
   - Auth Service (port 3001)
   - Order Service (port 3002)
   - Main Backend Service (port 3000)

2. **Verify containers are running**:

   ```bash
   docker-compose ps
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f
   ```

### Manual Docker Deployment

If you need to deploy each service individually:

1. **Auth Service**:

   ```bash
   cd microservices/auth-service
   docker build -t smart-dhaba/auth-service .
   docker run -d -p 3001:3001 --name auth-service smart-dhaba/auth-service
   ```

2. **Order Service**:
   ```bash
   cd microservices/order-service
   docker build -t smart-dhaba/order-service .
   docker run -d -p 3002:3002 --name order-service smart-dhaba/order-service
   ```

## Production Deployment

### Prerequisites

- A VPS or cloud server (AWS, Azure, GCP, DigitalOcean, etc.)
- MongoDB Atlas account or a managed MongoDB service
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt is free)
- Nginx for reverse proxy

### Server Setup

1. **Update and upgrade the server**:

   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Docker and Docker Compose**:

   ```bash
   # Install Docker
   sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
   sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
   sudo apt update
   sudo apt install -y docker-ce

   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Install Nginx**:

   ```bash
   sudo apt install -y nginx
   ```

4. **Configure Nginx as a reverse proxy**:
   Create a new Nginx configuration file:

   ```bash
   sudo nano /etc/nginx/sites-available/smart-dhaba
   ```

   Add the following configuration:

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site:

   ```bash
   sudo ln -s /etc/nginx/sites-available/smart-dhaba /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **SSL with Let's Encrypt**:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Application Deployment

1. **Clone the repository**:

   ```bash
   git clone <repository-url> /opt/smart-dhaba
   cd /opt/smart-dhaba/smart-dhabba-backend
   ```

2. **Set up environment variables**:
   Create production `.env` files for each service with secure values.

3. **Update the Docker Compose configuration**:
   Edit `docker-compose.yaml` to use production settings.

4. **Start the application**:
   ```bash
   docker-compose up -d
   ```

### CI/CD Setup (Optional)

1. **Set up GitHub Actions or GitLab CI**:
   Create a workflow file to automate:

   - Testing
   - Building Docker images
   - Deploying to the production server

2. **Example GitHub Actions workflow**:

   ```yaml
   name: Deploy Smart-Dhaba

   on:
     push:
       branches: [main]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Deploy to production
           uses: appleboy/ssh-action@master
           with:
             host: ${{ secrets.HOST }}
             username: ${{ secrets.USERNAME }}
             key: ${{ secrets.SSH_KEY }}
             script: |
               cd /opt/smart-dhaba
               git pull
               cd smart-dhabba-backend
               docker-compose up -d --build
   ```

## Database Backup and Restore

### Backup MongoDB

```bash
docker exec mongodb mongodump --out /data/backup
docker cp mongodb:/data/backup ./backup
```

### Restore MongoDB

```bash
docker cp ./backup mongodb:/data/backup
docker exec mongodb mongorestore /data/backup
```

## Monitoring and Logging

1. **Set up Prometheus and Grafana**:

   ```bash
   cd /opt/monitoring
   git clone https://github.com/vegasbrianc/prometheus.git
   cd prometheus
   docker-compose up -d
   ```

2. **Log monitoring with ELK Stack or Graylog**:
   Configure Docker to send logs to your logging solution.

## Scaling Considerations

- Set up replicas for each service
- Implement load balancing with Nginx or HAProxy
- Configure MongoDB replication for high availability
- Consider using Kubernetes for orchestration in larger deployments

## Troubleshooting

### Common Issues

1. **Connection issues with MongoDB**:

   - Verify MongoDB is running: `docker ps | grep mongodb`
   - Check MongoDB logs: `docker logs mongodb`
   - Ensure the connection string is correct in the environment variables

2. **Microservices not communicating**:

   - Check the Docker network: `docker network inspect auth-network`
   - Ensure services can resolve each other by container name

3. **Application errors**:
   - Check application logs: `docker-compose logs -f`
4. **Nginx proxy issues**:
   - Check Nginx error logs: `sudo cat /var/log/nginx/error.log`
   - Test Nginx configuration: `sudo nginx -t`
