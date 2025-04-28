import { Link } from 'wouter';
import { LogoIcon } from '@/components/icons';
import { useSettings } from '@/hooks/use-settings';
import { useState } from 'react';

export default function Footer() {
  const { settings } = useSettings();
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  const handleAdminClick = () => {
    // Trigger the login modal from App.tsx
    const trigger = document.getElementById('admin-login-trigger');
    if (trigger) {
      trigger.click();
    }
  };
  
  return (
    <footer className="bg-secondary pt-10 pb-6 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-montserrat font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg className="text-primary w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a href="tel:+79123456789" className="text-gray-300 hover:text-white">+7 (912) 345-67-89</a>
              </li>
              <li className="flex items-center">
                <svg className="text-primary w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <a href="mailto:info@damaskshop.ru" className="text-gray-300 hover:text-white">info@damaskshop.ru</a>
              </li>
              <li className="flex items-center">
                <svg className="text-primary w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5 0-.28-.03-.56-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
                <a href="#" className="text-gray-300 hover:text-white">@damaskshop</a>
              </li>
              <li className="flex items-center">
                <svg className="text-primary w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm.51 15.88h-2.17c-.73 0-.96-.31-2.01-1.38-1.03-1-1.49-1.14-1.75-1.14-.36 0-.46.1-.46.58v1.25c0 .41-.13.7-1.19.7-1.75 0-3.68-1.06-5.09-3.03-2.04-2.82-2.6-4.92-2.6-5.37 0-.32.11-.61.59-.61h2.17c.45 0 .62.22.79.72.86 2.46 2.29 4.64 2.89 4.64.22 0 .32-.1.32-.67v-2.59c-.07-1.19-.69-1.29-.69-1.71 0-.21.17-.41.44-.41h3.4c.41 0 .54.2.54.65v3.51c0 .38.13.52.23.52.21 0 .39-.13.79-.55 1.19-1.3 2.05-3.35 2.05-3.35.11-.25.34-.54.83-.54h2.17c.65 0 .79.33.65.72-.27 1.26-2.88 4.93-2.88 4.93-.23.37-.31.52 0 .93.22.31.97 1 1.46 1.59.89 1.08 1.56 1.99 1.74 2.61.19.62-.1.94-.72.94z" />
                </svg>
                <a href="#" className="text-gray-300 hover:text-white">vk.com/damaskshop</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-montserrat font-semibold mb-4">Информация</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">О нас</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Условия доставки</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Политика конфиденциальности</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Правила использования</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-montserrat font-semibold mb-4">Сервис</h3>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-gray-300 hover:text-white">Каталог товаров</a></Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Новинки</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Акции</a></li>
              <li>
                <button 
                  onClick={handleAdminClick} 
                  className="text-gray-300 hover:text-white flex items-center"
                >
                  <svg className="text-primary w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg> 
                  Администрирование
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/">
              <a className="flex items-center">
                <LogoIcon className="w-6 h-6 mr-3" />
                <h1 className="text-lg font-bold font-montserrat text-white">
                  <span className="text-primary neon-effect">{settings?.shopName?.split(' ')[0] || 'Damask'}</span> {settings?.shopName?.split(' ')[1] || 'Shop'}
                </h1>
              </a>
            </Link>
          </div>
          
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Damask Shop. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
