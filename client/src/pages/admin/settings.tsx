import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Settings as SettingsIcon, BarChart2, Package, UploadCloud, Download, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { useSyncGoogleSheets, useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { useAuth } from "@/hooks/use-auth";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { LogoIcon } from "@/components/icons";
import { InventorySummary } from "@/components/inventory-summary";

// Схема валидации формы
const formSchema = z.object({
  shopName: z.string().min(1, "Название магазина обязательно"),
  shopDescription: z.string().optional(),
  logoUrl: z.string().optional(),
  googleSheetsUrl: z.string().optional(),
  googleApiKey: z.string().optional(),
});

export default function SettingsPage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const syncGoogleSheets = useSyncGoogleSheets();
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Инициализация формы
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopName: "",
      shopDescription: "",
      logoUrl: "",
      googleSheetsUrl: "",
      googleApiKey: "",
    },
  });
  
  // Обновление формы при загрузке данных
  useEffect(() => {
    if (settings) {
      form.reset({
        shopName: settings.shopName || "",
        shopDescription: settings.description || "",
        logoUrl: settings.logo || "",
        googleSheetsUrl: settings.googleSheetsUrl || "",
        googleApiKey: settings.googleApiKey || "",
      });
    }
  }, [settings, form]);
  
  // Обработка отправки формы
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateSettings.mutateAsync({
        shopName: values.shopName,
        description: values.shopDescription,
        logo: values.logoUrl,
        googleSheetsUrl: values.googleSheetsUrl,
        googleApiKey: values.googleApiKey,
      });
      
      toast({
        title: "Настройки сохранены",
        description: "Изменения успешно применены",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      });
    }
  };
  
  // Обработка синхронизации с Google Таблицами
  const handleSyncGoogleSheets = async () => {
    if (!form.getValues().googleSheetsUrl || !form.getValues().googleApiKey) {
      toast({
        title: "Ошибка синхронизации",
        description: "Укажите URL таблицы и API ключ Google",
        variant: "destructive",
      });
      return;
    }
    
    setIsSyncing(true);
    try {
      await syncGoogleSheets.mutateAsync();
      toast({
        title: "Синхронизация завершена",
        description: "Данные успешно обновлены из Google Таблиц",
      });
    } catch (error) {
      toast({
        title: "Ошибка синхронизации",
        description: "Не удалось получить данные из Google Таблиц",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Обработка выхода из системы
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Отображение загрузки
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-secondary">
      <div className="flex">
        {/* Боковая панель */}
        <div className="hidden md:flex h-screen w-64 flex-col bg-[#1E1E1E] border-r border-gray-800 fixed">
          <div className="p-4 flex items-center border-b border-gray-800">
            <LogoIcon className="w-8 h-8 mr-2" />
            <h1 className="text-lg font-bold font-montserrat">
              Панель администратора
            </h1>
          </div>
          
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              <Link href="/admin">
                <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer">
                  <BarChart2 className="mr-3 h-5 w-5" />
                  Обзор
                </div>
              </Link>
              <Link href="/admin/products">
                <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer">
                  <Package className="mr-3 h-5 w-5" />
                  Товары
                </div>
              </Link>
              <Link href="/admin/settings">
                <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary text-white cursor-pointer">
                  <SettingsIcon className="mr-3 h-5 w-5" />
                  Настройки
                </div>
              </Link>
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <span className="ml-3 text-sm font-medium">{user?.username}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Мобильный хедер */}
        <div className="md:hidden bg-[#1E1E1E] border-b border-gray-800 w-full fixed top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <LogoIcon className="w-8 h-8 mr-2" />
              <h1 className="text-lg font-bold font-montserrat">
                Панель администратора
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Основное содержимое */}
        <div className="flex-1 md:ml-64">
          <div className="container mx-auto px-4 py-8 md:py-6 mt-[61px] md:mt-0">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold font-montserrat">Настройки</h1>
                <p className="text-gray-400">Управление настройками магазина</p>
              </div>
              
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                className="bg-primary hover:bg-primary/90 text-white"
                disabled={updateSettings.isPending}
              >
                {updateSettings.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>Сохранить настройки</>
                )}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Основная форма настроек */}
              <div className="lg:col-span-2 space-y-6">
                <InventorySummary />
                
                <Form {...form}>
                  <form>
                    <Card className="bg-[#1E1E1E] border-gray-800 text-white">
                      <CardHeader>
                        <CardTitle>Основные настройки</CardTitle>
                        <CardDescription className="text-gray-400">
                          Настройки отображения сайта
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="shopName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Название магазина</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Введите название магазина" 
                                  className="bg-secondary border-gray-700 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="shopDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Описание магазина</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="Добавьте краткое описание магазина" 
                                  className="bg-secondary border-gray-700 text-white h-20 resize-none"
                                />
                              </FormControl>
                              <FormDescription className="text-gray-500">
                                Будет отображаться в подвале сайта и мета-тегах
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="logoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Логотип</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Укажите URL логотипа" 
                                  className="bg-secondary border-gray-700 text-white"
                                />
                              </FormControl>
                              <FormDescription className="text-gray-500">
                                Укажите относительный путь от корня сайта, например: /logo.svg
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-[#1E1E1E] border-gray-800 text-white mt-6">
                      <CardHeader>
                        <CardTitle>Интеграция с Google Таблицами</CardTitle>
                        <CardDescription className="text-gray-400">
                          Настройка синхронизации товаров с Google Таблицами
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="googleSheetsUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL Google Таблицы</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="https://docs.google.com/spreadsheets/d/ВАШ_ID_ТАБЛИЦЫ/edit" 
                                  className="bg-secondary border-gray-700 text-white"
                                />
                              </FormControl>
                              <FormDescription className="text-gray-500">
                                Укажите полный URL таблицы для синхронизации
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="googleApiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API ключ Google</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="password"
                                  placeholder="Введите ваш API ключ Google" 
                                  className="bg-secondary border-gray-700 text-white"
                                />
                              </FormControl>
                              <FormDescription className="text-gray-500">
                                Ключ с доступом к Google Sheets API
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {settings?.lastSyncTime && (
                          <div className="flex items-center mt-2 text-sm text-gray-400">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Последняя синхронизация: {new Date(settings.lastSyncTime).toLocaleString()}
                          </div>
                        )}
                        
                        <div className="flex flex-col space-y-2">
                          <p className="text-sm text-amber-400">
                            <strong>Формат таблицы Google Sheets:</strong>
                          </p>
                          <ul className="text-xs text-gray-400 list-disc pl-5">
                            <li>В ячейке A1: "SKU", B1: "Количество", C1: "Гагарина", D1: "Победа"</li>
                            <li>Для каждого товара: артикул в колонке A, общее количество в B, количество в магазине на Гагарина в C, и на Победе в D</li>
                            <li>Обязательно откройте доступ к таблице по ссылке (для просмотра)</li>
                          </ul>
                        </div>
                        
                        <div className="flex items-center space-x-4 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-gray-700 text-white"
                            onClick={handleSyncGoogleSheets}
                            disabled={isSyncing}
                          >
                            {isSyncing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Синхронизация...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Синхронизировать сейчас
                              </>
                            )}
                          </Button>
                          
                          <a 
                            href="/client/src/assets/google-sheets-template.csv" 
                            download="google-sheets-template.csv"
                            className="inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-white hover:bg-gray-800"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Скачать шаблон таблицы
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </form>
                </Form>
              </div>
              
              {/* Боковые карточки с инструкциями */}
              <div className="space-y-6">
                <Card className="bg-[#1E1E1E] border-gray-800 text-white">
                  <CardHeader>
                    <CardTitle>Инструкция по синхронизации</CardTitle>
                    <CardDescription className="text-gray-400">
                      Как настроить Google Таблицы
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h3 className="font-medium text-white">1. Создайте Google Таблицу</h3>
                        <p className="text-gray-400 mt-1">Создайте новую таблицу или используйте скачанный шаблон</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-white">2. Настройте структуру</h3>
                        <p className="text-gray-400 mt-1">
                          Таблица должна содержать следующие столбцы:
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>SKU - уникальный код товара</li>
                            <li>Name - название товара (опционально)</li>
                            <li>Status - статус наличия (in_stock, out_of_stock, coming_soon)</li>
                          </ul>
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-white">3. Получите API ключ</h3>
                        <p className="text-gray-400 mt-1">
                          Создайте ключ API в <a href="https://console.cloud.google.com/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-white">4. Настройте доступ</h3>
                        <p className="text-gray-400 mt-1">Откройте доступ к таблице для всех, у кого есть ссылка (режим "Просмотр")</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-gray-800 to-[#1E1E1E] border-gray-800 text-white">
                  <CardHeader>
                    <CardTitle>Помощь</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm">
                      Если у вас возникли вопросы по настройке интеграции или работе с панелью администратора, свяжитесь с нами:
                    </p>
                    <p className="mt-2 text-primary">support@damaskshop.ru</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}