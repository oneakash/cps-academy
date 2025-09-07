'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';

interface Course {
  id: number;
  Title: string;
  Description: any[];
  Thumbnail: any[];
  IsActive: boolean;
  modules: any[];
}

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError('');

        const jwt = localStorage.getItem('jwt');
        const headers: any = {
          'Content-Type': 'application/json',
        };

        if (jwt) {
          headers['Authorization'] = `Bearer ${jwt}`;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/courses?populate=*`, {
          method: 'GET',
          headers,
        });

        if (!res.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await res.json();
        setCourses(data.data || []);
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const extractPlainText = (richText: any[]): string => {
    if (!Array.isArray(richText)) return '';
    return richText
      .map((node) => {
        if (node.type === 'paragraph' && node.children) {
          return node.children
            .filter((child: any) => child.type === 'text')
            .map((child: any) => child.text)
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ')
      .trim();
  };

  const getUserRoleName = () => {
    if (!user?.role) return 'authenticated';
    return user.role.type || user.role.name || 'authenticated';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading courses...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Courses</h1>
          {user && (
            <p className="text-gray-600">
              Welcome back, <span className="font-medium">{user.username}</span>! 
              You have <span className="font-medium">{getUserRoleName()}</span> access.
            </p>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-book-open text-gray-400 text-6xl mb-4"></i>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No courses available</h2>
            <p className="text-gray-500">Check back later for new courses!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const thumbnail = course.Thumbnail?.[0];
              const imageUrl = thumbnail?.url
                ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${thumbnail.url}`
                : 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400';

              return (
                <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={imageUrl}
                    alt={thumbnail?.alternativeText || course.Title}
                    className="w-full h-48 object-cover"
                  />
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {course.Title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {extractPlainText(course.Description)}
                    </p>

                    {/* Role-based content */}
                    <RoleGuard 
                      allowedRoles={['student', 'social_media_manager', 'developer']}
                      fallback={
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                          <p className="text-yellow-800 text-sm">
                            <i className="fas fa-lock mr-2"></i>
                            Enroll to access full course details
                          </p>
                        </div>
                      }
                    >
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <i className="fas fa-list-ul mr-2"></i>
                          <span>{course.modules?.length || 0} modules</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <i className={`fas ${course.IsActive ? 'fa-check-circle text-green-500' : 'fa-pause-circle text-orange-500'} mr-2`}></i>
                          <span>{course.IsActive ? 'Active' : 'Coming Soon'}</span>
                        </div>
                      </div>
                    </RoleGuard>

                    <Link
                      href={`/courses/${course.id}`}
                      className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}