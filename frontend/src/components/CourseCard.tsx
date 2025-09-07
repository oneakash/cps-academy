import Link from 'next/link';

interface Thumbnail {
  url: string;
  alternativeText: string | null;
}

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  thumbnail: Thumbnail | null; // Can be null if no image
}

const CourseCard: React.FC<CourseCardProps> = ({ id, title, description, thumbnail }) => {
  const imageUrl = thumbnail?.url
    ? thumbnail.url.startsWith('/uploads')
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${thumbnail.url}`
      : thumbnail.url
    : 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'; // Fallback

  const altText = thumbnail?.alternativeText || title;

  return (
    <Link 
      href={`/courses/${id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
    >
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-blue-600">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        <div className="flex items-center text-blue-600 font-medium">
          <i className="fas fa-arrow-right mr-2"></i>
          <span>View Course Details</span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;