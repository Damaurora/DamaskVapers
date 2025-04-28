import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useProducts, useDeleteProduct } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { Product, ProductStatus } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { LogoIcon } from "@/components/icons";
import { BarChart2, Package, Settings, MoreVertical, Edit, Trash2, Plus, Search } from "lucide-react";

export default function Products() {
  const { user, logoutMutation } = useAuth();
  const { products, isLoading } = useProducts();
  const { categories } = useCategories();
  const deleteProductMutation = useDeleteProduct();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Handle product deletion
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProductMutation.mutateAsync(productToDelete.id);
      toast({
        title: "Товар удален",
        description: `${productToDelete.name} был успешно удален`,
      });
      setProductToDelete(null);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар",
        variant: "destructive",
      });
    }
  };
  
  // Filter products based on search term and status filter
  const filteredProducts = products?.filter(product => {
    const matchesSearchTerm = 
      searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatusFilter = 
      statusFilter === null || 
      product.status === statusFilter;
    
    return matchesSearchTerm && matchesStatusFilter;
  });
  
  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    return categories?.find(c => c.id === categoryId)?.name || "—";
  };
  
  // Get status text
  const getStatusText = (status: string) => {
    switch(status) {
      case ProductStatus.IN_STOCK:
        return "В наличии";
      case ProductStatus.OUT_OF_STOCK:
        return "Не в наличии";
      case ProductStatus.COMING_SOON:
        return "Ждём завоз";
      default:
        return "Неизвестный статус";
    }
  };

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
                <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer">
                  <BarChart2 className="mr-3 h-5 w-5" />
                  Обзор
                </div>
              </Link>
              <Link href="/admin/products">
                <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary text-white cursor-pointer">
                  <Package className="mr-3 h-5 w-5" />
                  Товары
                </div>
              </Link>
              <Link href="/admin/settings">
                <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer">
                  <Settings className="mr-3 h-5 w-5" />
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
              <Button variant="default" size="sm" className="whitespace-nowrap bg-primary">
                <Package className="w-4 h-4 mr-2" />
                Товары
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="ghost" size="sm" className="whitespace-nowrap">
                <Settings className="w-4 h-4 mr-2" />
                Настройки
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 md:ml-64">
          <div className="container mx-auto px-4 py-8 md:py-6 mt-[126px] md:mt-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold font-montserrat">Управление товарами</h1>
                <p className="text-gray-400">Добавление, редактирование и удаление товаров</p>
              </div>
              
              <Link href="/admin/products/new">
                <Button className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить товар
                </Button>
              </Link>
            </div>
            
            <Card className="bg-[#1E1E1E] border-gray-800 text-white mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      placeholder="Поиск товаров..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-secondary border-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="flex space-x-2 flex-wrap md:flex-nowrap gap-2">
                    <Button
                      variant={statusFilter === null ? "default" : "outline"}
                      className={statusFilter === null ? "bg-primary" : "border-gray-700 text-white"}
                      onClick={() => setStatusFilter(null)}
                    >
                      Все
                    </Button>
                    <Button
                      variant={statusFilter === ProductStatus.IN_STOCK ? "default" : "outline"}
                      className={statusFilter === ProductStatus.IN_STOCK ? "bg-[#22C55E]" : "border-gray-700 text-white"}
                      onClick={() => setStatusFilter(ProductStatus.IN_STOCK)}
                    >
                      В наличии
                    </Button>
                    <Button
                      variant={statusFilter === ProductStatus.OUT_OF_STOCK ? "default" : "outline"}
                      className={statusFilter === ProductStatus.OUT_OF_STOCK ? "bg-[#EF4444]" : "border-gray-700 text-white"}
                      onClick={() => setStatusFilter(ProductStatus.OUT_OF_STOCK)}
                    >
                      Не в наличии
                    </Button>
                    <Button
                      variant={statusFilter === ProductStatus.COMING_SOON ? "default" : "outline"}
                      className={statusFilter === ProductStatus.COMING_SOON ? "bg-[#F59E0B]" : "border-gray-700 text-white"}
                      onClick={() => setStatusFilter(ProductStatus.COMING_SOON)}
                    >
                      Ждём завоз
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1E1E1E] border-gray-800 text-white">
              <CardHeader>
                <CardTitle>Товары ({filteredProducts?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      <p className="mt-4 text-gray-400">Загрузка товаров...</p>
                    </div>
                  </div>
                ) : filteredProducts?.length === 0 ? (
                  <div className="text-center py-10">
                    <Package className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium">Товары не найдены</h3>
                    <p className="text-gray-400 mt-2">
                      {searchTerm || statusFilter 
                        ? "Попробуйте изменить параметры поиска или фильтра"
                        : "Добавьте первый товар, чтобы он появился здесь"}
                    </p>
                    {!searchTerm && !statusFilter && (
                      <Link href="/admin/products/new">
                        <Button className="mt-4 bg-primary hover:bg-primary/90 text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Добавить товар
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-secondary/50 border-gray-800">
                          <TableHead className="text-white">ID</TableHead>
                          <TableHead className="text-white">Изображение</TableHead>
                          <TableHead className="text-white">Название</TableHead>
                          <TableHead className="text-white">Категория</TableHead>
                          <TableHead className="text-white">Статус</TableHead>
                          <TableHead className="text-white">Артикул</TableHead>
                          <TableHead className="text-white text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts?.map((product) => (
                          <TableRow key={product.id} className="hover:bg-secondary/50 border-gray-800">
                            <TableCell className="font-medium">{product.id}</TableCell>
                            <TableCell>
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-10 h-10 object-cover rounded"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                                  <Package className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                            <TableCell>
                              <StatusBadge status={product.status} className="px-2 py-1 text-xs rounded-full">
                                {getStatusText(product.status)}
                              </StatusBadge>
                            </TableCell>
                            <TableCell>{product.sku || "—"}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Меню</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#1E1E1E] border-gray-800 text-white">
                                  <DropdownMenuItem 
                                    className="cursor-pointer hover:bg-gray-800"
                                    onClick={() => setLocation(`/admin/products/edit/${product.id}`)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Редактировать</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="cursor-pointer text-red-500 hover:bg-gray-800 hover:text-red-500"
                                    onClick={() => setProductToDelete(product)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Удалить</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent className="bg-[#1E1E1E] border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Вы собираетесь удалить товар "{productToDelete?.name}". Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-white hover:bg-gray-800 hover:text-white">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteProduct}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
