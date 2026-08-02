# CPS Academy - Course Management Platform

A comprehensive web application built with Next.js and Strapi for course management with role-based access control.

## 🚀 Project Overview

CPS Academy is a modern learning management platform that provides role-based access to courses and modules. The application features secure authentication, user management, and dynamic content rendering based on user roles.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.5.2 (React Framework)
- **Backend**: Strapi 5.23.1 (Headless CMS)
- **Styling**: Tailwind CSS 4.0
- **Authentication**: JWT-based authentication
- **Database**: SQLite (development) / PostgreSQL (production)
- **Language**: TypeScript

## 📋 Features

### Authentication & User Management
- ✅ Secure JWT-based authentication
- ✅ User registration and login
- ✅ Password recovery and reset
- ✅ Role-based access control

### User Roles
- **Public User**: Limited access to course previews
- **Student**: Access to full course details and modules
- **Social Media Manager**: Access to courses + additional marketing content
- **Developer**: Full access to all content and technical resources

### Course Management
- ✅ Course creation with rich text descriptions
- ✅ Module organization with detailed information
- ✅ Thumbnail image support
- ✅ Role-based content visibility
- ✅ Topics and class count tracking

### Frontend Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dynamic content rendering based on user roles
- ✅ Clean and intuitive user interface
- ✅ Loading states and error handling
- ✅ Navigation with user context

## 🏗️ Project Structure

```
cps-academy/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── lib/            # Utility functions
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript definitions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Strapi application
│   ├── src/
│   │   ├── api/            # API endpoints
│   │   ├── config/         # Configuration files
│   │   └── extensions/     # Custom extensions
│   ├── config/             # Strapi configuration
│   └── package.json
├── .env.example            # Environment variables template
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Backend Setup (Strapi)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS="your-app-keys-here"
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

5. Start the development server:
```bash
npm run develop
```

6. Access Strapi admin panel at `http://localhost:1337/admin` and create your admin account.

### Frontend Setup (Next.js)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp ../.env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

5. Start the development server:
```bash
npm run dev
```

6. Access the application at `http://localhost:3000`

## 🔧 Configuration

### Strapi Content Types

The project includes two main content types:

#### Course
- Title (String, Required)
- Description (Rich Text)
- Thumbnail (Media)
- IsActive (Boolean)
- AccessRoles (JSON)
- modules (Relation to Module)

#### Module
- Name (String, Required)
- Details (Rich Text)
- NumberOfClasses (Integer)
- TopicsCovered (JSON)
- Order (Integer)
- course (Relation to Course)

### User Roles

Configure the following roles in Strapi:
- `authenticated` - Default role for registered users
- `student` - Access to course content
- `social_media_manager` - Marketing content access
- `developer` - Full technical access

## 🔐 Environment Variables

### Backend (.env)
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS="key1,key2,key3,key4"
API_TOKEN_SALT=random-salt
ADMIN_JWT_SECRET=admin-secret
TRANSFER_TOKEN_SALT=transfer-salt
JWT_SECRET=jwt-secret
ENCRYPTION_KEY=encryption-key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/local` - User login
- `POST /api/auth/local/register` - User registration
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get specific course with modules
- `GET /api/courses?populate=*` - Get courses with populated relations

### Modules
- `GET /api/modules` - Get all modules
- `GET /api/modules/:id` - Get specific module

## 🎨 UI Components

### Key Components
- `Navigation` - Main navigation with user context
- `RoleGuard` - Role-based content protection
- `CourseCard` - Course preview cards
- `StudentDashboard` - User dashboard
- `AuthProvider` - Authentication context

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the application:
```bash
cd frontend && npm run build
```

2. Deploy to your preferred platform with environment variables configured.

### Backend (Railway/Heroku)
1. Configure production database (PostgreSQL recommended)
2. Set production environment variables
3. Deploy Strapi application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Enhanced role management and UI improvements
- **v1.2.0** - Added course modules and advanced filtering
