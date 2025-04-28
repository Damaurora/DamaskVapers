import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import ProductPage from "@/pages/product-page";
import Dashboard from "@/pages/admin/dashboard";
import Products from "@/pages/admin/products";
import ProductForm from "@/pages/admin/product-form";
import Settings from "@/pages/admin/settings";
import { ProtectedRoute } from "@/lib/protected-route";
import AdminLoginModal from "@/components/admin-login-modal";
import AgeVerificationModal from "@/components/age-verification-modal";
import { useRef, useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/product/:id" component={ProductPage} />
      <ProtectedRoute path="/admin" component={Dashboard} />
      <ProtectedRoute path="/admin/products" component={Products} />
      <ProtectedRoute path="/admin/products/new" component={() => <ProductForm mode="create" />} />
      <ProtectedRoute path="/admin/products/edit/:id" component={() => <ProductForm mode="edit" />} />
      <ProtectedRoute path="/admin/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const loginModalRef = useRef<HTMLDivElement>(null);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">
            <Router />
          </main>
          <AdminLoginModal 
            isOpen={isLoginModalOpen} 
            onClose={closeLoginModal} 
            ref={loginModalRef} 
          />
          <AgeVerificationModal />
          <Toaster />
        </div>
        <div id="admin-login-trigger" className="hidden" onClick={openLoginModal} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
