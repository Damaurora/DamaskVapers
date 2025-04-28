import { useState } from "react";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoIcon } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { BarChart2, Package, Settings as SettingsIcon, Loader2, Upload, Link as LinkIcon, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSettings, useUpdateSettings, useSyncGoogleSheets } from "@/hooks/use-settings";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user, logoutMutation } = useAuth();
  const { settings, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();
  const syncGoogleSheetsMutation = useSyncGoogleSheets();
  const { toast } = useToast();
  
  const [logoUrl, setLogoUrl] = useState(settings?.logo || "");
  const [shopName, setShopName] = useState(settings?.shopName || "Damask Shop");
  const [googleSheetUrl, setGoogleSheetUrl] = useState(settings?.googleSheetUrl || "");
  const [syncFrequency, setSyncFrequency] = useState(settings?.syncFrequency || "manual");
  const [logoUploadMethod, setLogoUploadMethod] = useState<"url" | "file">("url");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  // Update state when settings are loaded
  useState(() => {
    if (settings) {
      setLogoUrl(settings.logo || "");
      setShopName(settings.shopName || "Damask Shop");
      setGoogleSheetUrl(settings.googleSheetUrl || "");
      setSyncFrequency(settings.syncFrequency || "manual");
    }
  });
  
  // Handle saving site settings
  const handleSaveSiteSettings = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        shopName,
        logo: logoUrl
      });
      
      toast({
        title: "Настройки сохранены",
        description: "Настройки сайта успешно обновлены",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      });
    }
  };
  
  // Handle saving Google Sheets settings
  const handleSaveGoogleSettings = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        googleSheetUrl,
        syncFrequency
      });
      
      toast({
        title: "Настройки сохранены",
        description: "Настройки синхронизации успешно обновлены",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      });
    }
  };
  
  // Handle logo file selection
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
      setLogoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };
  
  // Handle manual sync with Google Sheets
  const handleManualSync = async () => {
    try {
      await syncGoogleSheetsMutation.mutateAsync();
      
      toast({
        title: "Синхронизация запущена",
        description: "Синхронизация с Google Таблицами запущена успешно",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось запустить синхронизацию",
        variant: "destructive",
      });
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
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
        {/* Sidebar */}
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
                <a className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white">
                  <BarChart2 className="mr-3 h-5 w-5" />
                  Обзор
                </a>
              </Link>
              <Link href="/admin/products">
                <a className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Package className="mr-3 h-5 w-5" />
                  Товары
                </a>
              </Link>
              <Link href="/admin/settings">
                <a className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary text-white">
                  <SettingsIcon className="mr-3 h-5 w-5" />
                  Настройки
                </a>
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
        
        {/* Mobile header */}
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
          
          <div className="flex space-x-2 p-2 bg-[#1E1E1E] overflow-x-auto">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="whitespace-nowrap">
                <BarChart2 className="w-4 h-4 mr-2" />
                Обзор
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="ghost" size="sm" className="whitespace-nowrap">
                <Package className="w-4 h-4 mr-2" />
                Товары
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="default" size="sm" className="whitespace-nowrap bg-primary">
                <SettingsIcon className="w-4 h-4 mr-2" />
                Настройки
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 md:ml-64">
          <div className="container mx-auto px-4 py-8 md:py-6 mt-[126px] md:mt-0">
            <div className="mb-6">
              <h1 className="text-2xl font-bold font-montserrat">Настройки</h1>
              <p className="text-gray-400">Управление настройками сайта и синхронизацией</p>
            </div>
            
            <Tabs defaultValue="site" className="space-y-6">
              <TabsList className="bg-[#1E1E1E]">
                <TabsTrigger value="site">Настройки сайта</TabsTrigger>
                <TabsTrigger value="sync">Синхронизация</TabsTrigger>
              </TabsList>
              
              <TabsContent value="site">
                <Card className="bg-[#1E1E1E] border-gray-800 text-white">
                  <CardHeader>
                    <CardTitle>Настройки сайта</CardTitle>
                    <CardDescription className="text-gray-400">
                      Управление основными параметрами отображения сайта
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="shop-name" className="mb-2 block">Название магазина</Label>
                      <Input 
                        id="shop-name" 
                        value={shopName} 
                        onChange={(e) => setShopName(e.target.value)} 
                        className="bg-secondary border-gray-700 text-white"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Название магазина будет отображаться в заголовке и футере
                      </p>
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Логотип</Label>
                      
                      <Tabs defaultValue={logoUploadMethod} onValueChange={(v) => setLogoUploadMethod(v as "url" | "file")}>
                        <TabsList className="grid grid-cols-2 bg-secondary">
                          <TabsTrigger value="url">URL ссылка</TabsTrigger>
                          <TabsTrigger value="file">Загрузка файла</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="url" className="mt-4">
                          <div className="flex items-center">
                            <Input 
                              type="text" 
                              placeholder="Введите URL логотипа" 
                              value={logoUrl} 
                              onChange={(e) => setLogoUrl(e.target.value)}
                              className="bg-secondary border-gray-700 text-white flex-1 mr-2"
                            />
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="border-gray-700 text-white"
                              onClick={() => {
                                if (logoUrl) {
                                  window.open(logoUrl, '_blank');
                                }
                              }}
                              disabled={!logoUrl}
                            >
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Введите прямую ссылку на изображение логотипа
                          </p>
                        </TabsContent>
                        
                        <TabsContent value="file" className="mt-4">
                          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-400 mb-2">
                              Перетащите файл сюда или нажмите для выбора
                            </p>
                            <Input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              id="logo-upload"
                              onChange={handleLogoFileChange}
                            />
                            <label htmlFor="logo-upload">
                              <Button 
                                variant="outline" 
                                className="border-gray-700 text-white"
                                onClick={(e) => e.preventDefault()}
                              >
                                Выбрать файл
                              </Button>
                            </label>
                          </div>
                          {logoFile && (
                            <p className="text-sm text-gray-400 mt-2">
                              Выбран файл: {logoFile.name}
                            </p>
                          )}
                        </TabsContent>
                      </Tabs>
                      
                      <div className="mt-4">
                        <Label className="mb-2 block">Предпросмотр</Label>
                        <div className="flex items-center mt-2 bg-secondary p-3 rounded-lg">
                          {logoUrl ? (
                            <div className="w-10 h-10 mr-3">
                              <img 
                                src={logoUrl} 
                                alt="Логотип" 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "https://via.placeholder.com/40?text=Ошибка";
                                }}
                              />
                            </div>
                          ) : (
                            <LogoIcon className="w-10 h-10 mr-3" />
                          )}
                          <h1 className="text-2xl font-bold font-montserrat text-white">
                            <span className="text-primary neon-effect">{shopName.split(' ')[0] || 'Damask'}</span> {shopName.split(' ')[1] || 'Shop'}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-gray-800 pt-6">
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-white ml-auto"
                      onClick={handleSaveSiteSettings}
                      disabled={updateSettingsMutation.isPending}
                    >
                      {updateSettingsMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        <>Сохранить настройки</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="sync">
                <Card className="bg-[#1E1E1E] border-gray-800 text-white">
                  <CardHeader>
                    <CardTitle>Синхронизация с Google Таблицами</CardTitle>
                    <CardDescription className="text-gray-400">
                      Настройка автоматической синхронизации товаров через Google Таблицы
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="google-sheet-url" className="mb-2 block">URL Google Таблицы</Label>
                      <Input 
                        id="google-sheet-url" 
                        value={googleSheetUrl} 
                        onChange={(e) => setGoogleSheetUrl(e.target.value)} 
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                        className="bg-secondary border-gray-700 text-white"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Введите URL таблицы с данными о товарах
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="sync-frequency" className="mb-2 block">Частота синхронизации</Label>
                      <Select
                        value={syncFrequency}
                        onValueChange={setSyncFrequency}
                      >
                        <SelectTrigger id="sync-frequency" className="bg-secondary border-gray-700 text-white">
                          <SelectValue placeholder="Выберите частоту" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1E1E1E] border-gray-700 text-white">
                          <SelectItem value="manual" className="focus:bg-gray-800 focus:text-white">Вручную</SelectItem>
                          <SelectItem value="hourly" className="focus:bg-gray-800 focus:text-white">Каждый час</SelectItem>
                          <SelectItem value="daily" className="focus:bg-gray-800 focus:text-white">Раз в день</SelectItem>
                          <SelectItem value="weekly" className="focus:bg-gray-800 focus:text-white">Раз в неделю</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-1">
                        Выберите, как часто данные будут обновляться автоматически
                      </p>
                    </div>
                    
                    <Separator className="bg-gray-800" />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Запуск синхронизации</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Вы можете запустить синхронизацию вручную в любой момент
                      </p>
                      <Button 
                        onClick={handleManualSync}
                        disabled={syncGoogleSheetsMutation.isPending || !googleSheetUrl}
                        className="bg-secondary border border-gray-700 hover:bg-gray-800 text-white"
                      >
                        {syncGoogleSheetsMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Синхронизация...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Запустить синхронизацию
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-gray-800 pt-6">
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-white ml-auto"
                      onClick={handleSaveGoogleSettings}
                      disabled={updateSettingsMutation.isPending}
                    >
                      {updateSettingsMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        <>Сохранить настройки</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
