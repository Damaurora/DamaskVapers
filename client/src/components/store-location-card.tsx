import { Store } from '@shared/schema';

interface StoreLocationCardProps {
  store: Store;
}

export default function StoreLocationCard({ store }: StoreLocationCardProps) {
  const { name, address, image, workHoursWeekdays, workHoursWeekend, phone } = store;
  
  const defaultImage = "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80";
  
  return (
    <div className="bg-secondary p-6 rounded-lg">
      <h3 className="text-xl font-semibold font-montserrat mb-4 flex items-center">
        <svg className="text-primary w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        {address}
      </h3>
      
      <img 
        src={image || defaultImage} 
        alt={`Магазин на ${address}`} 
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <svg className="text-primary w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span className="text-gray-300">Пн-Пт: {workHoursWeekdays}</span>
        </div>
        <div className="flex items-center">
          <svg className="text-primary w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span className="text-gray-300">Сб-Вс: {workHoursWeekend}</span>
        </div>
      </div>
      
      <div className="flex items-center">
        <svg className="text-primary w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
        <a href={`tel:${phone}`} className="text-gray-300 hover:text-white">{phone}</a>
      </div>
    </div>
  );
}
