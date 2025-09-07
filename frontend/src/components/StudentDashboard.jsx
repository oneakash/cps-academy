
import React, { useEffect, useState } from "react";
import ShowModulesButton from "@/components/ShowModulesButton"; 
import { BookOpen } from "lucide-react";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [expanded, setExpanded] = useState({});
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

  useEffect(() => {
    const url = `${API_URL}/api/courses?populate=*`;
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("🎯 Full API Response:", data);
        setCourses(data.data || []);
      })
      .catch((err) => {
        console.error("❌ Error fetching courses:", err);
      });
  }, []);

  const toggleExpand = (courseId) => {
    setExpanded((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  // Helper function to extract text from Strapi's rich text format
  const extractTextFromRichText = (richText) => {
    if (!richText || !Array.isArray(richText)) return "No description available.";
    
    return richText
      .map(paragraph => 
        paragraph.children
          .filter(child => child.type === 'text')
          .map(child => child.text)
          .join(' ')
      )
      .join(' ');
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">No courses available.</p>
      ) : (
        courses.map((course) => {
          const moduleCount = course.modules?.length || 0;
          const isExpanded = expanded[course.id];

          return (
            <div
              key={course.id}
              className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200 flex flex-col"
            >
              {/* Thumbnail */}
              {course.Thumbnail && course.Thumbnail.length > 0 && (
                <img
                  src={`${API_URL}${course.Thumbnail[0].url}`}
                  alt={course.Thumbnail[0].alternativeText || course.Title}
                  className="w-full h-40 object-cover"
                />
              )}

              <div className="p-5 flex-1 flex flex-col">
                {/* Title */}
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-blue-800">
                  <BookOpen className="w-5 h-5" />
                  {course.Title || "Untitled Course"}
                </h2>

                {/* Description */}
                <div className="text-gray-700 mb-4 text-sm leading-relaxed flex-1">
                  {extractTextFromRichText(course.Description)}
                </div>

                {/* Button */}
                <ShowModulesButton
                  isExpanded={isExpanded}
                  onClick={() => toggleExpand(course.id)}
                  moduleCount={moduleCount}
                />

                {/* Modules List */}
                {isExpanded && (
                  <div className="mt-5 space-y-3 animate-fadeIn">
                    {moduleCount > 0 ? (
                      course.modules.map((module) => (
                        <div
                          key={module.id}
                          className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                        >
                          <h3 className="font-semibold text-gray-800">
                            {module.Name || "Unnamed Module"}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {extractTextFromRichText(module.Details)}
                          </p>
                          
                          {/* Display Topics if available */}
                          {module.TopicsCovered && module.TopicsCovered.topics && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-gray-700">Topics:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {module.TopicsCovered.topics.map((topic, index) => (
                                  <span 
                                    key={index} 
                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Display number of classes */}
                          <div className="mt-2 text-xs text-gray-500">
                            {module.NumberOfClasses} classes
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 mt-3">No modules to display.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}