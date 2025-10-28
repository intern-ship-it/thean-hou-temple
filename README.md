\# 🏯 Thean Hou Temple Management System

A full-stack temple management application with React frontend and Laravel backend.

\## 🏗️ Project Structure

```

thean-hou-temple/

├── frontend/          # React + Vite + Tailwind CSS

├── backend/           # Laravel 12 API

├── deploy.sh          # Production build script

└── README.md

```

\## 🚀 Development Setup

\### Prerequisites

\- Node.js 18+ and npm

\- PHP 8.2+

\- Composer

\- MySQL/MariaDB

\### Frontend Setup

```bash

cd frontend

npm install

cp .env.example .env

npm run dev

\# Runs on http://localhost:5173

```

\### Backend Setup

```bash

cd backend

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate

php artisan db:seed

php artisan serve

\# Runs on http://localhost:8000

```

\## 📦 Production Deployment

\### Build for Production

```bash

\# From project root

./deploy.sh

```

\### Upload to cPanel

1\. Compress the `backend` folder as ZIP

2\. Upload to cPanel File Manager

3\. Extract in `public\_html` or your domain folder

4\. Configure domain to point to `public` subfolder

5\. Update `.env` with production database credentials

6\. Run migrations:

```bash

&nbsp;  php artisan config:cache

&nbsp;  php artisan migrate --force

```

\## 🔧 Environment Variables

\### Frontend (.env)

```env

VITE\_API\_URL=http://localhost:8000/api

```

\### Backend (.env)

```env

APP\_NAME="Thean Hou Temple"

APP\_ENV=local

APP\_URL=http://localhost:8000

DB\_CONNECTION=mysql

DB\_DATABASE=thean\_hou

DB\_USERNAME=root

DB\_PASSWORD=

```

\## 🎯 Features

\- User authentication and authorization

\- Role-based access control

\- Multi-language support (EN/中文/BM)

\- Donation management

\- Event management

\- Administrative dashboard

\## 🛠️ Tech Stack

\*\*Frontend:\*\*

\- React 19.1.1

\- Vite

\- Tailwind CSS

\- Axios

\- React Router

\*\*Backend:\*\*

\- Laravel 12

\- MySQL

\- Sanctum (Authentication)

\## 📝 License

Proprietary - Thean Hou Temple

\## 👥 Development Team

Built with ❤️ for Thean Hou Temple
