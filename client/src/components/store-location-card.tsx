
import { useState } from 'react';
import { Store } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Save, X } from 'lucide-react';

interface StoreLocationCardProps {
  store: Store;
  onEdit?: (store: Store) => void;
}

export default function StoreLocationCard({ store, onEdit }: StoreLocationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStore, setEditedStore] = useState(store);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/stores/${store.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedStore),
      });

      if (response.ok) {
        setIsEditing(false);
        if (onEdit) {
          onEdit(editedStore);
        }
      }
    } catch (error) {
      console.error('Error updating store:', error);
    }
  };

  if (isEditing) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border-gray-800">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Input
              value={editedStore.name}
              onChange={(e) => setEditedStore({ ...editedStore, name: e.target.value })}
              placeholder="Название магазина"
              className="bg-secondary border-gray-700"
            />
            <Input
              value={editedStore.address}
              onChange={(e) => setEditedStore({ ...editedStore, address: e.target.value })}
              placeholder="Адрес"
              className="bg-secondary border-gray-700"
            />
            <Input
              value={editedStore.phone}
              onChange={(e) => setEditedStore({ ...editedStore, phone: e.target.value })}
              placeholder="Телефон"
              className="bg-secondary border-gray-700"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4 mr-1" />
                Отмена
              </Button>
              <Button 
                size="sm"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-1" />
                Сохранить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-gray-800">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-medium">{store.name}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 text-gray-400">
          <p>{store.address}</p>
          <p>{store.phone}</p>
        </div>
      </CardContent>
    </Card>
  );
}
