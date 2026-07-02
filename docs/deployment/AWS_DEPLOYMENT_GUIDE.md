# AWS Deployment Guide: HU Preferred Partner Platform

> A comprehensive, step-by-step guide for deploying the Habib University Preferred Partner Platform on AWS.

---

## Table of Contents

1. [AWS Architecture Overview](#1-aws-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [EC2 Setup](#3-ec2-setup)
4. [PostgreSQL Installation](#4-postgresql-installation)
5. [Node.js Installation](#5-nodejs-installation)
6. [Backend Deployment](#6-backend-deployment)
7. [Frontend Deployment](#7-frontend-deployment)
8. [Reverse Proxy (Nginx)](#8-reverse-proxy)
9. [HTTPS (SSL)](#9-https)
10. [Process Management (PM2)](#10-process-management)
11. [Environment Variables](#11-environment-variables)
12. [Security](#12-security)
13. [Database Management](#13-database-management)
14. [Monitoring](#14-monitoring)
15. [Updating the Application](#15-updating-the-application)
16. [Troubleshooting](#16-troubleshooting)
17. [Scaling Considerations](#17-scaling-considerations)
18. [Disaster Recovery](#18-disaster-recovery)
19. [Deployment Checklist](#19-deployment-checklist)

---

## 1. AWS Architecture Overview

This document distinguishes between the **current testing state** and the **target production state**.

### Current Testing State (Single EC2 Instance)

Currently, the application is deployed in a cost-effective, consolidated environment using a single `t3.micro` instance (eligible for the AWS Free Tier). This setup hosts the frontend, backend, and PostgreSQL database on the same machine. Nginx acts as a reverse proxy, and PM2 manages the Node.js processes.

```mermaid
graph TD
    Internet((Internet)) -->|HTTP/HTTPS| EC2[AWS EC2 t3.micro]
    
    subgraph "Single EC2 Instance (Ubuntu 24.04)"
        Nginx[Nginx Reverse Proxy]
        
        Nginx -->|Port 3000| NextJS[Next.js Frontend / PM2]
        Nginx -->|Port 4000| NestJS[NestJS Backend / PM2]
        
        NestJS -->|Port 5432| Postgres[(PostgreSQL 15)]
    end
```

### Future Production State (Decoupled Infrastructure)

For full production readiness, the architecture should decouple the database (using RDS) and potentially containerise the application using ECS (Elastic Container Service). Scaling considerations are discussed in [Section 17](#17-scaling-considerations).

---

## 2. Prerequisites

Before starting, ensure you have the following:

- **AWS Account**: Active and accessible.
- **IAM User**: Recommended over using the Root account. Ensure the user has permissions for EC2 management.
- **Key Pair**: An RSA or ED25519 `.pem` key pair created in AWS for SSH access.
- **Region**: Select the region closest to your target audience (e.g., `ap-south-1` for Pakistan/South Asia).
- **Domain Name** (Optional but recommended): Access to a DNS provider (e.g., Route53, Cloudflare, Namecheap) to point an A record to your EC2 instance.
- **Elastic IP** (Optional): A static IP address mapped to your EC2 instance so the IP doesn't change on reboot.

---

## 3. EC2 Setup

### Launching the Instance

1. Navigate to the **EC2 Dashboard** in the AWS Console.
2. Click **Launch Instance**.
3. **Name**: `hu-preferred-partner-server`.
4. **AMI**: Select **Ubuntu Server 24.04 LTS (HVM)**.
5. **Instance Type**: Select `t3.micro` (or larger depending on your load).
6. **Key Pair**: Select your previously created key pair.
7. **Network Settings**:
   - Auto-assign Public IP: Enable.
   - Create a new Security Group with the following inbound rules:
     - **SSH (22)**: Restrict to your IP (recommended for security) or leave open (`0.0.0.0/0`).
     - **HTTP (80)**: `0.0.0.0/0`
     - **HTTPS (443)**: `0.0.0.0/0`
     - **Custom TCP (3000)**: `0.0.0.0/0` (Optional: used for direct backend API testing).
8. **Storage**: Configure at least `20 GB` gp3 storage.
9. Click **Launch instance**.

### Connecting via SSH

```bash
# Set appropriate permissions for your key
chmod 400 your-key.pem

# Connect to the instance (replace IP with your EC2 Public IP)
ssh -i /path/to/your-key.pem ubuntu@<your-ec2-ip>
```

### Initial Server Preparation

Update package lists and upgrade existing software:

```bash
sudo apt update
sudo apt upgrade -y
```

Install essential utilities:

```bash
sudo apt install -y curl wget git vim build-essential unzip
```

*(Optional but recommended)* Create a dedicated deployment user:
```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
```

---

## 4. PostgreSQL Installation

The current testing environment uses PostgreSQL 15 running directly on the EC2 instance.

### Installation

```bash
sudo apt install -y postgresql-15 postgresql-contrib
```

Verify the service is running:

```bash
sudo systemctl status postgresql
sudo systemctl enable postgresql
```

### Initialisation & User Creation

Switch to the default `postgres` user to configure the database:

```bash
sudo -u postgres psql
```

Execute the following SQL commands to secure the root user, create the application database, and configure a dedicated user:

```sql
-- Set password for the default postgres user
ALTER USER postgres PASSWORD 'your_secure_postgres_password';

-- Create the application database
CREATE DATABASE my_testing_db;

-- Create application user
CREATE USER hu_app_user WITH ENCRYPTED PASSWORD 'your_secure_app_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE my_testing_db TO hu_app_user;

-- Exit psql
\q
```

### Configuration (Local vs Remote Access)

By default, PostgreSQL is only accessible locally (`localhost`). This is the **most secure** and recommended configuration when the app and database share the same instance. 

If you ever need external access (e.g., connecting a GUI client like pgAdmin/DBeaver), you must modify two files:

1. **`postgresql.conf`** (`/etc/postgresql/15/main/postgresql.conf`)
   Change `listen_addresses = 'localhost'` to `listen_addresses = '*'`.
2. **`pg_hba.conf`** (`/etc/postgresql/15/main/pg_hba.conf`)
   Add: `host all all 0.0.0.0/0 scram-sha-256` at the end.

Restart PostgreSQL after changes: `sudo systemctl restart postgresql`.

---

## 5. Node.js Installation

We use Node Version Manager (NVM) to manage Node versions easily without requiring `sudo` for global packages.

### Installing NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Reload your bash profile to use nvm:
```bash
source ~/.bashrc
```

### Installing Node.js v22

```bash
nvm install 22
nvm use 22
nvm alias default 22
```

Verify installation:
```bash
node -v   # Should output v22.x.x
npm -v    # Should output npm version
```

### Installing pnpm (Monorepo Package Manager)

```bash
npm install -g pnpm
```

---

## 6. Backend Deployment

The backend is built with NestJS and utilizes Prisma/TypeORM.

### Cloning and Setup

```bash
# Clone the repository
git clone https://github.com/muneeb2004/HUPreferredPartnerProgram.git
cd HUPreferredPartnerProgram

# Install all dependencies across the monorepo
pnpm install
```

### Environment Configuration

Create the backend environment file:

```bash
cp apps/api/.env.example apps/api/.env
nano apps/api/.env
```

Set the database connection string:
```env
DATABASE_URL="postgresql://hu_app_user:your_secure_app_password@localhost:5432/my_testing_db?schema=public"
# Add JWT_SECRET, PORT (e.g., 4000), etc.
```

### Build and Migrate

```bash
# Generate Prisma Client (if applicable)
pnpm --filter api prisma generate

# Run database migrations
pnpm --filter api prisma migrate deploy

# Build the backend application
pnpm --filter api build
```

### Starting the Server (Testing without PM2)

You can test if it works natively first:
```bash
pnpm --filter api start:prod
```
Access `http://<your-ec2-ip>:4000` (ensure Port 4000 is open in Security Groups for this raw test). You should see the default NestJS "Hello World!" or API health check.

---

## 7. Frontend Deployment

The frontend is built with Next.js App Router (React Server Components). 

### Setup and Build

```bash
# Navigate to root if not already there
cd ~/HUPreferredPartnerProgram

# Configure Environment Variables
cp apps/web/.env.example apps/web/.env.local
nano apps/web/.env.local
```

Ensure the frontend knows where the backend is located:
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1" 
# NOTE: Once HTTPS and Nginx are set up, this should be updated to the public domain URL.
```

Build the application:
```bash
pnpm --filter web build
```

### Deployment Considerations

- **Same EC2 Instance (Current)**: Serving Next.js (port 3000) and NestJS (port 4000) on the same instance via Nginx. Simple, cheap, effective for testing.
- **Vercel**: Next.js natively thrives on Vercel. You can decouple the frontend to Vercel (push to deploy) and keep the backend + DB on EC2. This provides global CDN out-of-the-box and zero-config Server Components support.

---

## 8. Reverse Proxy (Nginx)

Nginx sits in front of your Node.js applications. It listens on port 80 (HTTP) and 443 (HTTPS), forwarding traffic to your frontend (port 3000) and backend (port 4000).

### Installation

```bash
sudo apt install -y nginx
```

### Configuration

Create a new Nginx server block:

```bash
sudo nano /etc/nginx/sites-available/hu-partner
```

Add the following configuration (replace `yourdomain.com` with your domain, or `_` if using raw IP):

```nginx
server {
    listen 80;
    server_name api.yourdomain.com; # Backend subdomain

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com; # Frontend domain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";
    }
}
```

Enable the configuration and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/hu-partner /etc/nginx/sites-enabled/
sudo nginx -t   # Test for syntax errors
sudo systemctl restart nginx
```

---

## 9. HTTPS (SSL)

Securing traffic with SSL is mandatory for production. We use Let's Encrypt and Certbot. Note: **You must have a domain name pointed at your EC2 instance's IP for this to work.**

### Installation

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Certificate Generation

Run Certbot. It will automatically read your Nginx config, provision the certificates, and configure HTTP to HTTPS redirects.

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

### Automatic Renewal

Certbot sets up a systemd timer for auto-renewal. Verify it:
```bash
sudo systemctl status certbot.timer
```

---

## 10. Process Management (PM2)

PM2 keeps your Node.js applications running continuously, automatically restarting them if they crash or if the server reboots.

### Installation

```bash
npm install -g pm2
```

### Running the Applications

Start the NestJS Backend:
```bash
cd ~/HUPreferredPartnerProgram
pm2 start apps/api/dist/main.js --name "hu-backend"
```

Start the Next.js Frontend:
```bash
cd ~/HUPreferredPartnerProgram/apps/web
pm2 start "pnpm start" --name "hu-frontend"
```

### Startup Script

To ensure PM2 launches the apps on system reboot:

```bash
pm2 startup
# Run the command PM2 outputs on the screen (it will look like: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu)
pm2 save
```

### PM2 Commands

- View logs: `pm2 logs`
- Monitor resources: `pm2 monit`
- Restart an app: `pm2 restart hu-backend`
- List apps: `pm2 list`

---

## 11. Environment Variables

Below is a reference for required environment variables. **Do not commit these to Git.**

### Backend (`apps/api/.env`)
```env
# Database
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<dbname>?schema=public"

# Security
JWT_SECRET="generate_a_long_random_string"
JWT_EXPIRATION="15m"
REFRESH_TOKEN_SECRET="another_long_random_string"
REFRESH_TOKEN_EXPIRATION="7d"

# Server
PORT=4000
NODE_ENV="production"
FRONTEND_URL="https://yourdomain.com"
```

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL="https://api.yourdomain.com/api/v1"
```

---

## 12. Security

### Best Practices

1. **Firewall (UFW)**: 
   Enable UFW to strictly lock down ports.
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```
2. **Fail2Ban**:
   Protects against brute-force SSH attacks.
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```
3. **Database Security**: Never expose port `5432` to the public internet in AWS Security Groups. Keep it confined to `localhost`.
4. **Least Privilege**: Application processes (PM2) should run as the `ubuntu` or `deploy` user, never as `root`.
5. **Secrets Management**: Use a secure generator (e.g., `openssl rand -base64 32`) for JWT secrets.

---

## 13. Database Management

### Backing Up the Database

Create a backup dump file:
```bash
pg_dump -U hu_app_user -h localhost -d my_testing_db -F c -f /home/ubuntu/db_backup_$(date +%F).dump
```

### Restoring the Database

```bash
pg_restore -U hu_app_user -h localhost -d my_testing_db -1 /path/to/backup.dump
```

*(Note: `-1` wraps the restore in a single transaction)*

### Schema Updates (Prisma)

When code updates include schema changes, apply them cautiously:
```bash
pnpm --filter api prisma migrate deploy
```

---

## 14. Monitoring

- **Application Logs**: PM2 handles Node logs (`pm2 logs`).
- **Nginx Logs**: Access logs (`/var/log/nginx/access.log`) and Error logs (`/var/log/nginx/error.log`).
- **PostgreSQL Logs**: Found in `/var/log/postgresql/`.
- **System Metrics**: Use AWS CloudWatch (free tier includes basic 5-minute CPU/Network metrics) or run `htop` locally on the server.

---

## 15. Updating the Application

When a new version is pushed to Git, follow this repeatable deployment workflow:

```bash
# 1. Pull latest code
cd ~/HUPreferredPartnerProgram
git pull origin main

# 2. Install any new dependencies
pnpm install

# 3. Build the applications
pnpm --filter api build
pnpm --filter web build

# 4. Run database migrations (if schema changed)
pnpm --filter api prisma migrate deploy

# 5. Restart services via PM2
pm2 restart all

# 6. Verify deployment (check logs and web access)
pm2 logs
```

---

## 16. Troubleshooting

### PostgreSQL Connection Failures
- **Error**: `Connection refused`
  - **Check**: Is Postgres running? (`sudo systemctl status postgresql`).
  - **Check**: Are credentials in `.env` exact? Does the DB name match?

### 502 Bad Gateway (Nginx)
- **Cause**: Nginx cannot reach your Node applications.
- **Check**: Are the PM2 processes online? (`pm2 list`).
- **Check**: Are the Node apps listening on the exact ports specified in the Nginx config (`3000` and `4000`)?

### PM2 Issues (Apps crashing instantly)
- **Check**: Read the error output: `pm2 logs hu-backend`.
- **Cause**: Usually missing `.env` variables, failing DB connections, or build compilation errors. Ensure you ran `pnpm build` before starting.

### Build Failures (Out of Memory)
- **Cause**: The `t3.micro` instance has 1GB of RAM. Heavy Next.js / NestJS builds can cause out-of-memory (OOM) crashes.
- **Solution**: Add a swap file.
  ```bash
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  # Make permanent
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  ```

---

## 17. Scaling Considerations

The current monolithic EC2 setup is excellent for testing, pilot phases, and low-traffic production. As the platform scales, transition to AWS managed services:

1. **Database**: Move PostgreSQL off EC2 to **Amazon RDS**. This provides automated backups, Multi-AZ redundancy, and easier vertical scaling.
2. **Frontend Deployment**: Move Next.js to **Vercel** or **AWS Amplify**. This offloads compute from the EC2 instance and serves UI assets from a global CDN.
3. **Containerisation**: Dockerise the NestJS backend and deploy it to **AWS ECS (Fargate)** for auto-scaling and stateless horizontal scaling.
4. **Load Balancing**: Place an **Application Load Balancer (ALB)** in front of ECS tasks.
5. **Assets**: Serve images, PDFs, and static files directly from **S3 + CloudFront** instead of passing them through the Node backend.

---

## 18. Disaster Recovery

1. **Automated DB Backups**: Schedule a cron job to run `pg_dump` daily and upload the `.dump` file to an S3 bucket.
2. **Instance Recovery**: In AWS, create an Amazon Machine Image (AMI) of your fully configured EC2 instance. If the instance fails, you can launch a new one from the AMI in minutes.
3. **Secrets Recovery**: Store `.env` variables securely in a password manager (e.g., 1Password, Bitwarden) or AWS Secrets Manager. If the server is destroyed, the source code is safe in Git, but the environment variables must be manually restored.

---

## 19. Deployment Checklist

Before announcing production availability, ensure the following are complete:

- [ ] **Infrastructure**: EC2 instance sized appropriately, swap file configured.
- [ ] **Security Groups**: Only ports 22, 80, and 443 are open to the world.
- [ ] **Database**: PostgreSQL secured with strong passwords, strictly bound to `localhost`.
- [ ] **Secrets**: Production-grade JWT secrets generated, `NODE_ENV` set to `production`.
- [ ] **Application**: Backend and frontend built and running via PM2.
- [ ] **Proxy & SSL**: Nginx configured, Let's Encrypt SSL active, HTTP redirects to HTTPS.
- [ ] **Monitoring**: PM2 set to auto-start on boot (`pm2 save`).
- [ ] **Backups**: Database dump strategy defined and tested.
- [ ] **Verification**: Can log in, create a partner, and view it on the frontend successfully.

---
*Generated for the Habib University Preferred Partner Platform.*
