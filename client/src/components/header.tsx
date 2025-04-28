import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { LogoIcon } from '@/components/icons';
import { useSettings } from '@/hooks/use-settings';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function Header({ onSearch }: { onSearch?: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className={`sticky top-0 z-50 bg-secondary border-b border-gray-800 transition-shadow ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <LogoIcon className="w-10 h-10 mr-3" />
                <h1 className="text-2xl font-bold font-montserrat text-white">
                  <span className="text-primary neon-effect">{settings?.shopName?.split(' ')[0] || 'Damask'}</span> {settings?.shopName?.split(' ')[1] || 'Shop'}
                </h1>
              </div>
            </Link>
          </div>
          
          <div className="relative w-full md:w-1/3">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Поиск товаров..."
                  className="bg-[#1E1E1E] w-full pl-10 pr-4 py-2 rounded-lg text-white border-gray-700 focus:border-primary"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
