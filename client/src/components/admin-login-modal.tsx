import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, forwardRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { LogoIcon } from "@/components/icons";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminLoginModal = forwardRef<HTMLDivElement, AdminLoginModalProps>(
  ({ isOpen, onClose }, ref) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { loginMutation } = useAuth();
    const { toast } = useToast();
    const [, setLocation] = useLocation();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!username || !password) {
        setError("Пожалуйста, заполните все поля");
        return;
      }

      try {
        await loginMutation.mutateAsync({ username, password });
        toast({
          title: "Успешный вход",
          description: "Вы успешно авторизовались в панели администратора",
        });
        onClose();
        setUsername("");
        setPassword("");
        setLocation("/admin");
      } catch (error) {
        setError("Неверное имя пользователя или пароль");
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent ref={ref} className="bg-[#1E1E1E] text-white border-gray-800 sm:max-w-md">
          <DialogHeader>
            <div className="text-center mb-6">
              <LogoIcon className="w-12 h-12 mx-auto mb-2" />
              <DialogTitle className="text-xl font-montserrat font-semibold">
                Вход в панель администратора
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-300">
                Имя пользователя
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-secondary border-gray-700 text-white focus:ring-primary"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-300">
                Пароль
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary border-gray-700 text-white focus:ring-primary"
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Вход..." : "Войти"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

AdminLoginModal.displayName = "AdminLoginModal";

export default AdminLoginModal;
