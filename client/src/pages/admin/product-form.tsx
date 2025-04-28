import { useState, useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";
import { Loader2, BarChart2, Package, Settings, ArrowLeft, Plus, X, UploadCloud, Link as LinkIcon } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import { useProduct, useCreateProduct, useUpdateProduct } from "@/hooks/use-products";
import { useToast } from "@/hooks/use-toast";
import { InsertProduct, ProductStatus } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Switch
} from "@/components/ui/switch";

interface ProductFormProps {
  mode: "create" | "edit";
}

export default function ProductForm({ mode }: ProductFormProps) {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/products/edit/:id");
  const { toast } = useToast();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { product, isLoading: isProductLoading } = useProduct(
    mode === "edit" && params?.id ? parseInt(params.id) : 0
  );
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [imageUploadMethod, setImageUploadMethod] = useState<"url" | "file">("url");
  
  // Form validation schema based on the InsertProduct schema
  const formSchema = z.object({
    name: z.string().min(1, "Название обязательно"),
    description: z.string().min(1, "Описание обязательно"),
    slug: z.string().min(1, "URL-адрес обязателен")
      .regex(/^[a-z0-9-]+$/, "Только строчные буквы, цифры и дефисы"),
    categoryId: z.number({
      required_error: "Выберите категорию",
      invalid_type_error: "Категория должна быть числом",
    }),
    status: z.string({
      required_error: "Выберите статус",
    }),
    sku: z.string().optional(),
    isFeatured: z.boolean().default(false),
  });

  type FormValues = z.infer<typeof formSchema>;
  
  // Create form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: 0,
      status: ProductStatus.IN_STOCK,
      sku: "",
      isFeatured: false,
    },
  });
  
  // Load existing product data if in edit mode
  useEffect(() => {
    if (mode === "edit" && product) {
      form.reset({
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        status: product.status,
        sku: product.sku || "",
        isFeatured: product.isFeatured,
      });
      
      setImageUrl(product.image || "");
      
      if (product.specifications) {
        setSpecs(product.specifications as Record<string, string>);
      }
    }
  }, [mode, product, form]);
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      // Prepare the product data
      const productData: Partial<InsertProduct> = {
        ...values,
        image: imageUrl,
        specifications: Object.keys(specs).length > 0 ? specs : undefined,
      };
      
      if (mode === "create") {
        await createProduct.mutateAsync(productData as InsertProduct);
        toast({
          title: "Товар добавлен",
          description: "Новый товар успешно добавлен в каталог",
        });
      } else if (mode === "edit" && product) {
        await updateProduct.mutateAsync({
          id: product.id,
          product: productData,
        });
        toast({
          title: "Товар обновлен",
          description: "Изменения успешно сохранены",
        });
      }
      
      // Navigate back to products list
      setLocation("/admin/products");
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить товар",
        variant: "destructive",
      });
    }
  };
  
  // Handle adding new specification
  const handleAddSpec = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setSpecs(prev => ({
        ...prev,
        [newSpecKey]: newSpecValue
      }));
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };
  
  // Handle removing specification
  const handleRemoveSpec = (key: string) => {
    setSpecs(prev => {
      const newSpecs = { ...prev };
      delete newSpecs[key];
      return newSpecs;
    });
  };
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };
  
  const isLoading = (mode === "edit" && isProductLoading) || isCategoriesLoading;
  const isPending = createProduct.isPending || updateProduct.isPending;
  
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
                <a className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary text-white">
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
        </div>
        
        {/* Main content */}
        <div className="flex-1 md:ml-64">
          <div className="container mx-auto px-4 py-8 md:py-6 mt-[61px] md:mt-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setLocation("/admin/products")} 
                  className="mr-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold font-montserrat">
                    {mode === "create" ? "Добавление товара" : "Редактирование товара"}
                  </h1>
                  <p className="text-gray-400">
                    {mode === "create" 
                      ? "Создайте новый товар для каталога" 
                      : "Изменение параметров существующего товара"}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation("/admin/products")}
                  className="border-gray-700 text-white"
                >
                  Отмена
                </Button>
                <Button 
                  onClick={form.handleSubmit(onSubmit)}
                  className="bg-primary hover:bg-primary/90 text-white"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>Сохранить</>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main form */}
              <div className="lg:col-span-2">
                <Card className="bg-[#1E1E1E] border-gray-800 text-white">
                  <CardHeader>
                    <CardTitle>Основная информация</CardTitle>
                    <CardDescription className="text-gray-400">
                      Заполните информацию о товаре
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Название товара</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Введите название товара" 
                                  className="bg-secondary border-gray-700 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Описание</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="Введите описание товара" 
                                  className="bg-secondary border-gray-700 text-white h-32 resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Категория</FormLabel>
                                <Select
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  defaultValue={field.value ? field.value.toString() : undefined}
                                  value={field.value ? field.value.toString() : undefined}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-secondary border-gray-700 text-white">
                                      <SelectValue placeholder="Выберите категорию" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-[#1E1E1E] border-gray-700 text-white">
                                    {categories?.map((category) => (
                                      <SelectItem 
                                        key={category.id} 
                                        value={category.id.toString()}
                                        className="focus:bg-gray-800 focus:text-white"
                                      >
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Статус наличия</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-secondary border-gray-700 text-white">
                                      <SelectValue placeholder="Выберите статус" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-[#1E1E1E] border-gray-700 text-white">
                                    <SelectItem 
                                      value={ProductStatus.IN_STOCK} 
                                      className="focus:bg-gray-800 focus:text-white"
                                    >
                                      В наличии
                                    </SelectItem>
                                    <SelectItem 
                                      value={ProductStatus.OUT_OF_STOCK} 
                                      className="focus:bg-gray-800 focus:text-white"
                                    >
                                      Не в наличии
                                    </SelectItem>
                                    <SelectItem 
                                      value={ProductStatus.COMING_SOON} 
                                      className="focus:bg-gray-800 focus:text-white"
                                    >
                                      Ждём завоз
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Артикул (SKU)</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="Введите артикул товара" 
                                    className="bg-secondary border-gray-700 text-white"
                                  />
                                </FormControl>
                                <FormDescription className="text-gray-500">
                                  Уникальный код для синхронизации с Google Таблицами
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Популярный товар</FormLabel>
                                  <FormDescription className="text-gray-500">
                                    Отображать в карусели на главной странице
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1E1E1E] border-gray-800 text-white mt-6">
                  <CardHeader>
                    <CardTitle>Характеристики</CardTitle>
                    <CardDescription className="text-gray-400">
                      Добавьте технические характеристики товара
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(specs).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                            <Input 
                              value={key} 
                              readOnly 
                              className="bg-secondary border-gray-700 text-white"
                            />
                            <Input 
                              value={value} 
                              readOnly 
                              className="bg-secondary border-gray-700 text-white"
                            />
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveSpec(key)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <div className="flex items-center gap-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                          <Input 
                            value={newSpecKey} 
                            onChange={(e) => setNewSpecKey(e.target.value)} 
                            placeholder="Название характеристики" 
                            className="bg-secondary border-gray-700 text-white"
                          />
                          <Input 
                            value={newSpecValue} 
                            onChange={(e) => setNewSpecValue(e.target.value)} 
                            placeholder="Значение" 
                            className="bg-secondary border-gray-700 text-white"
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={handleAddSpec}
                          disabled={!newSpecKey.trim() || !newSpecValue.trim()}
                          className="border-gray-700 text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Image upload and preview */}
              <div>
                <Card className="bg-[#1E1E1E] border-gray-800 text-white">
                  <CardHeader>
                    <CardTitle>Изображение товара</CardTitle>
                    <CardDescription className="text-gray-400">
                      Загрузите изображение товара
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue={imageUploadMethod} onValueChange={(v) => setImageUploadMethod(v as "url" | "file")}>
                      <TabsList className="grid grid-cols-2 bg-secondary">
                        <TabsTrigger value="url">URL ссылка</TabsTrigger>
                        <TabsTrigger value="file">Загрузка файла</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="url" className="mt-4">
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <Input 
                              type="text" 
                              placeholder="Введите URL изображения" 
                              value={imageUrl} 
                              onChange={(e) => setImageUrl(e.target.value)}
                              className="bg-secondary border-gray-700 text-white flex-1 mr-2"
                            />
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="border-gray-700 text-white"
                              onClick={() => {
                                if (imageUrl) {
                                  window.open(imageUrl, '_blank');
                                }
                              }}
                              disabled={!imageUrl}
                            >
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500">
                            Введите прямую ссылку на изображение товара
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="file" className="mt-4">
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                            <UploadCloud className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-400 mb-2">
                              Перетащите файл сюда или нажмите для выбора
                            </p>
                            <Input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              id="image-upload"
                              onChange={handleFileChange}
                            />
                            <label htmlFor="image-upload">
                              <Button 
                                variant="outline" 
                                className="border-gray-700 text-white"
                                onClick={(e) => e.preventDefault()}
                              >
                                Выбрать файл
                              </Button>
                            </label>
                          </div>
                          {imageFile && (
                            <p className="text-sm text-gray-400">
                              Выбран файл: {imageFile.name}
                            </p>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <Separator className="my-6 bg-gray-800" />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Предпросмотр</h3>
                      {imageUrl ? (
                        <div className="border border-gray-700 rounded-lg overflow-hidden">
                          <img 
                            src={imageUrl} 
                            alt="Предпросмотр товара" 
                            className="w-full aspect-video object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/400x300?text=Ошибка+загрузки";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="border border-gray-700 rounded-lg flex items-center justify-center h-48 bg-secondary">
                          <p className="text-gray-500">Нет изображения</p>
                        </div>
                      )}
                    </div>
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
