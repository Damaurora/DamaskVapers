import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/icons";
import { X } from "lucide-react";

export default function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Проверяем, было ли уже подтверждение возраста
  useEffect(() => {
    const hasVerified = localStorage.getItem("age-verified");
    if (!hasVerified) {
      setIsOpen(true);
    }
  }, []);
  
  // Обработчик подтверждения возраста
  const handleConfirm = () => {
    localStorage.setItem("age-verified", "true");
    setIsOpen(false);
  };
  
  // Обработчик отказа от подтверждения возраста
  const handleDeny = () => {
    window.location.href = "https://google.com";
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1E1E1E] border-gray-800 text-white">
        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <LogoIcon className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Проверка возраста</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Вам должно быть 18 лет или больше для доступа на сайт
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="text-center mb-4">
            <span className="text-5xl font-bold text-primary">18+</span>
          </div>
          <p className="mb-4">
            Товары, представленные на сайте, предназначены только для совершеннолетних.
            Подтвердите, что вам уже исполнилось 18 лет.
          </p>
          <div className="relative h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <span className="absolute inset-0 flex">
              <span className="w-1/2 bg-primary animate-pulse"></span>
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between gap-4">
          <Button
            variant="outline"
            className="w-full border-gray-700 text-white hover:border-gray-600"
            onClick={handleDeny}
          >
            <X className="mr-2 h-4 w-4" />
            Нет, мне меньше 18
          </Button>
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white"
            onClick={handleConfirm}
          >
            Да, мне больше 18
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}