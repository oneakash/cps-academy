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
    : 'https://via.placeholder.com/400x200?text=No+Image'; // Fallback

  const altText = thumbnail?.alternativeText || title;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-green-600">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        <Link 
      href={`/login?redirect=/courses/${id}`} 
      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105"
    >
      <div className="p-6">
        <div className="flex items-center text-blue-600 font-medium">
          <i className="fas fa-lock mr-2"></i>
          <span>Login to view modules</span>
        </div>
      </div>
    </Link>
      </div>
    </div>
  );
};

export default CourseCard;