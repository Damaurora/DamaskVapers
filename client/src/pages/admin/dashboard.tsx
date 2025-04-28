import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { ProductStatus } from "@shared/schema";
import { BarChart, LineChart, BarChart2, Package, ShoppingBag, Users, Settings, List } from "lucide-react";
import { LogoIcon } from "@/components/icons";

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  const { products } = useProducts();
  const { categories } = useCategories();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Count products by status
  const inStockCount = products?.filter(p => p.status === ProductStatus.IN_STOCK).length || 0;
  const outOfStockCount = products?.filter(p => p.status === ProductStatus.OUT_OF_STOCK).length || 0;
  const comingSoonCount = products?.filter(p => p.status === ProductStatus.COMING_SOON).length || 0;
  const totalProductsCount = products?.length || 0;
  
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
                <a className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary text-white">
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
                <a className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Settings className="mr-3 h-5 w-5" />
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
          
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="products">Товары</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="hidden">
              {/* This is just for navigation, content is below */}
            </TabsContent>
            <TabsContent value="products" className="hidden">
              <div className="flex justify-center p-4">
                <Link href="/admin/products">
                  <Button className="w-full">Перейти к товарам</Button>
                </Link>
              </div>
            </TabsContent>
            <TabsContent value="settings" className="hidden">
              <div className="flex justify-center p-4">
                <Link href="/admin/settings">
                  <Button className="w-full">Перейти к настройкам</Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Main content */}
        <div className="flex-1 md:ml-64">
          <div className="container mx-auto px-4 py-8 md:py-6 mt-[118px] md:mt-0">
            <div className="mb-6">
              <h1 className="text-2xl font-bold font-montserrat">Обзор</h1>
              <p className="text-gray-400">Добро пожаловать в панель администратора Damask Shop.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-[#1E1E1E] border-gray-800 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Всего товаров</p>
                      <p className="text-3xl font-bold">{totalProductsCount}</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Package className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1E1E1E] border-gray-800 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">В наличии</p>
                      <p className="text-3xl font-bold">{inStockCount}</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1E1E1E] border-gray-800 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Ждём завоз</p>
                      <p className="text-3xl font-bold">{comingSoonCount}</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
                      <BarChart className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1E1E1E] border-gray-800 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Категории</p>
                      <p className="text-3xl font-bold">{categories?.length || 0}</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <List className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-[#1E1E1E] border-gray-800 text-white col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Управление товарами</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Link href="/admin/products/new">
                      <Button className="bg-primary hover:bg-primary/90 text-white">
                        Добавить товар
                      </Button>
                    </Link>
                    <Link href="/admin/products">
                      <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                        Все товары
                      </Button>
                    </Link>
                  </div>
                  
                  <Separator className="my-4 bg-gray-800" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">В наличии</span>
                      <span className="text-green-500 font-medium">{inStockCount}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${totalProductsCount > 0 ? (inStockCount / totalProductsCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Не в наличии</span>
                      <span className="text-red-500 font-medium">{outOfStockCount}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2.5">
                      <div 
                        className="bg-red-500 h-2.5 rounded-full" 
                        style={{ width: `${totalProductsCount > 0 ? (outOfStockCount / totalProductsCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ждём завоз</span>
                      <span className="text-yellow-500 font-medium">{comingSoonCount}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2.5">
                      <div 
                        className="bg-yellow-500 h-2.5 rounded-full" 
                        style={{ width: `${totalProductsCount > 0 ? (comingSoonCount / totalProductsCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1E1E1E] border-gray-800 text-white">
                <CardHeader>
                  <CardTitle>Быстрые действия</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/admin/products">
                      <Button variant="outline" className="w-full justify-start border-gray-700 text-white hover:bg-gray-800">
                        <Package className="mr-2 h-4 w-4" />
                        Управление товарами
                      </Button>
                    </Link>
                    <Link href="/admin/settings">
                      <Button variant="outline" className="w-full justify-start border-gray-700 text-white hover:bg-gray-800">
                        <Settings className="mr-2 h-4 w-4" />
                        Настройки сайта
                      </Button>
                    </Link>
                    <Link href="/admin/settings">
                      <Button variant="outline" className="w-full justify-start border-gray-700 text-white hover:bg-gray-800">
                        <BarChart className="mr-2 h-4 w-4" />
                        Синхронизация с Google
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline" className="w-full justify-start border-gray-700 text-white hover:bg-gray-800">
                        <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Просмотр сайта
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
