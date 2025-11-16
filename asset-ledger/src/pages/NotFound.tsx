import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center p-8 rounded-xl shadow-lg bg-card border border-border max-w-md w-full">
        <div className="mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-primary">404</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <Button 
          onClick={() => window.location.href = "/"} 
          className="flex items-center gap-2 mx-auto"
        >
          <Home className="h-4 w-4" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;