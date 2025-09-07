import type { Metadata } from "next";
import { coursesAPI } from "@/services/api";
import CourseCard from "@/components/CourseCard";
import { extractPlainText } from "@/lib/extract-text";

export const metadata: Metadata = {
  title: "CPS Academy — Courses",
  description: "Browse public course previews from CPS Academy.",
};

async function getCourseSummaries(page = 1, pageSize = 12) {
  const url = `/api/courses?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=Thumbnail`;
  const response = await coursesAPI.getAll(url);

  const courses = response.data.data.map((item: any) => {
    const thumbnail =
      item.Thumbnail?.length > 0
        ? {
            url: item.Thumbnail[0].url,
            alternativeText: item.Thumbnail[0].alternativeText || item.Title,
          }
        : null;

    return {
      id: item.id,
      title: item.Title || "Untitled Course",
      description: extractPlainText(item.Description),
      thumbnail,
    };
  });

  return {
    courses,
    meta: response.data.meta,
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);

  let response: any;
  try {
    response = await getCourseSummaries(currentPage, 12);
  } catch (e) {
    console.error("Failed to load courses:", e);
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">CPS Academy</h1>
        <p className="mt-4 text-red-600">
          Could not load courses. Please try again later.
        </p>
      </main>
    );
  }

  const courses = response.courses || [];
  const pagination = response.meta?.pagination;
  const page = pagination?.page || currentPage;
  const pageCount = pagination?.pageCount || 1;
  const total = pagination?.total || courses.length;

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white py-28 overflow-hidden">
        <div className="mx-auto max-w-6xl text-center px-6 relative z-10">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight drop-shadow-md">
            Unlock Your Potential with{" "}
            <span className="text-yellow-300">CPS Academy</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Learn in-demand skills from expert instructors. Explore, enroll, and
            grow your knowledge with our curated courses.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <a
              href="/signup"
              className="bg-yellow-400 text-black px-7 py-3 rounded-xl font-semibold shadow-lg hover:bg-yellow-500 hover:scale-105 transition transform"
            >
              Sign Up
            </a>
            <a
              href="/login"
              className="bg-white text-blue-700 px-7 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-100 hover:scale-105 transition transform"
            >
              Login
            </a>
            <a
              href="#courses"
              className="border border-white px-7 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-700 hover:scale-105 transition transform"
            >
              Browse Courses
            </a>
          </div>
        </div>

        {/* Decorative blur circle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-blue-900 opacity-20 blur-3xl rounded-full"></div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured Courses
        </h2>

        {courses.length === 0 ? (
          <p className="text-gray-600 text-center">
            No courses available yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course: any) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-14 flex justify-center items-center gap-6">
            {page > 1 ? (
              <a
                href={`/?page=${page - 1}`}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
              >
                ← Previous
              </a>
            ) : (
              <span className="px-4 py-2 rounded-lg bg-gray-50 text-gray-400">
                ← Previous
              </span>
            )}

            <span className="text-gray-600">
              Page <strong>{page}</strong> of {pageCount}
            </span>

            {page < pageCount ? (
              <a
                href={`/?page=${page + 1}`}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
              >
                Next →
              </a>
            ) : (
              <span className="px-4 py-2 rounded-lg bg-gray-50 text-gray-400">
                Next →
              </span>
            )}
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Showing {courses.length} of {total} courses
        </p>
      </section>
    </main>
  );
}
