import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/icons";

export default function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Проверяем, подтверждал ли пользователь возраст ранее
    const hasVerifiedAge = localStorage.getItem("age-verified");
    
    if (!hasVerifiedAge) {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    // Сохраняем подтверждение в localStorage
    localStorage.setItem("age-verified", "true");
    setIsOpen(false);
  };

  const handleDecline = () => {
    // Перенаправляем пользователя на Google
    window.location.href = "https://www.google.com";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1E1E1E] border-gray-800 text-white sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <LogoIcon className="w-16 h-16 text-primary mb-4" />
          <DialogTitle className="text-xl font-bold">
            Подтверждение возраста
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Сайт содержит информацию о никотиносодержащей продукции
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <AlertTriangle className="h-16 w-16 text-amber-500" />
          <p className="text-center text-md">
            Для доступа к сайту вам должно быть не менее 18 лет.
            <br />
            Подтвердите, что вы достигли совершеннолетия.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="sm:w-full border-gray-700 hover:bg-gray-800"
            onClick={handleDecline}
          >
            Мне нет 18 лет
          </Button>
          <Button
            className="sm:w-full bg-primary hover:bg-primary/90 text-white"
            onClick={handleConfirm}
          >
            Мне есть 18 лет
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}