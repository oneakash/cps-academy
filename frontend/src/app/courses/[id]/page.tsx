'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import RoleGuard from '@/components/RoleGuard';

interface Module {
  id: number;
  Name: string;
  Details: any[];
  NumberOfClasses: number;
  TopicsCovered: any;
}

interface Course {
  id: number;
  Title: string;
  Description: any[];
  Thumbnail: any[];
  IsActive: boolean;
  modules: Module[];
}

export default function CourseDetailPage() {
  const { id } = useParams(); // Course ID from URL
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
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

        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/courses/${id}?populate=*`, {
          method: 'GET',
          headers,
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Unauthorized. Please log in.');
          } else if (res.status === 404) {
            throw new Error('Course not found.');
          } else {
            throw new Error('Failed to fetch course data');
          }
        }

        const data = await res.json();

        if (data?.data) {
          setCourse(data.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err: any) {
        console.error('Error fetching course:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

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
        <span className="ml-3 text-gray-600">Loading course...</span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600 mt-2">{error}</p>
          <Link href="/courses" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const thumbnail = course.Thumbnail?.[0];
  const imageUrl = thumbnail?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${thumbnail.url}`
    : 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/courses" className="text-gray-500 hover:text-gray-700">
                Courses
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-800 font-medium">{course.Title}</li>
          </ol>
        </nav>

        {/* Course Detail Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Thumbnail */}
          <img
            src={imageUrl}
            alt={thumbnail?.alternativeText || course.Title}
            className="w-full h-64 md:h-80 object-cover"
          />

          <div className="p-6">
            {/* Title & Description */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {course.Title}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-6">
              {extractPlainText(course.Description)}
            </p>

            {/* Course Status */}
            <div className="mb-6 flex items-center">
              <i className={`fas ${course.IsActive ? 'fa-check-circle text-green-500' : 'fa-pause-circle text-orange-500'} mr-2`}></i>
              <span className={`font-medium ${course.IsActive ? 'text-green-700' : 'text-orange-700'}`}>
                {course.IsActive ? 'Course Active' : 'Coming Soon'}
              </span>
            </div>

            {/* Modules Section - Only for authorized roles */}
            <RoleGuard 
              allowedRoles={['student', 'social_media_manager', 'developer']}
              fallback={
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-center">
                  <i className="fas fa-lock text-blue-400 text-4xl mb-4"></i>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">
                    Enroll to Access Full Content
                  </h3>
                  <p className="text-blue-700 mb-5">
                    Unlock all modules, lessons, and resources by enrolling in this course.
                  </p>
                  <p className="text-blue-600 text-sm mb-4">
                    Your current role: <span className="font-medium">{getUserRoleName()}</span>
                  </p>
                  <button
                    onClick={() => alert('Enrollment feature coming soon!')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
                  >
                    Enroll Now
                  </button>
                </div>
              }
            >
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-5 border-b pb-2">
                  Course Modules
                </h2>
                <div className="space-y-6">
                  {course.modules && course.modules.length > 0 ? (
                    course.modules.map((module) => (
                      <div
                        key={module.id}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                          {module.Name}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {extractPlainText(module.Details)}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center">
                            <i className="fas fa-chalkboard-teacher mr-1"></i>
                            {module.NumberOfClasses} classes
                          </span>
                        </div>
                        {module.TopicsCovered && module.TopicsCovered.topics && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Topics:</h4>
                            <div className="flex flex-wrap gap-2">
                              {module.TopicsCovered.topics.map((topic: string, index: number) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No modules available yet.</p>
                  )}
                </div>
              </section>
            </RoleGuard>
          </div>
        </div>
      </div>
    </div>
  );
}