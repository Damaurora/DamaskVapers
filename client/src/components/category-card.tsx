import { Link } from 'wouter';
import { getCategoryIcon } from '@/components/icons';
import { Category } from '@shared/schema';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { id, name, icon, slug } = category;
  
  return (
    <Link href={`/?category=${slug}`}>
      <a className="flex flex-col items-center p-4 bg-[#1E1E1E] rounded-lg hover:bg-gray-800 transition-all duration-300">
        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-2">
          {getCategoryIcon(icon, 'text-primary w-6 h-6')}
        </div>
        <span className="text-sm font-medium text-center">{name}</span>
      </a>
    </Link>
  );
}
