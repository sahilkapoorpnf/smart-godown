import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Leaf, Lock, User, Building2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const roles = [
  { code: "SA", name: "Super Admin" },
  { code: "HQ", name: "HQ Admin" },
  { code: "AO", name: "Area Office Manager" },
  { code: "WM", name: "Warehouse Manager" },
  { code: "WS", name: "Warehouse Staff" },
  { code: "PM", name: "Procurement Manager" },
  { code: "DO", name: "Distribution Officer" },
  { code: "FM", name: "Fuel Manager" },
  { code: "AU", name: "Auditor" },
  { code: "FA", name: "Finance Officer" },
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo, navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 grain-texture pointer-events-none" />
        
        {/* Floating shapes */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 -left-10 w-60 h-60 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 flex flex-col justify-center p-16 text-primary-foreground">
          <Link to="/" className="inline-flex items-center gap-3 mb-12">
            <div className="p-3 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm">
              <Leaf className="w-8 h-8" />
            </div>
            <div>
              <div className="font-serif font-bold text-2xl">HIMFED</div>
              <div className="text-sm text-primary-foreground/70">Smart Control System</div>
            </div>
          </Link>

          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Welcome Back to
            <span className="block text-secondary">Your Dashboard</span>
          </h1>
          
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Access your role-specific modules and manage HIMFED operations 
            with complete transparency and efficiency.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <div className="text-3xl font-bold text-secondary">150+</div>
              <div className="text-sm text-primary-foreground/70">Godowns Connected</div>
            </div>
            <div className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <div className="text-3xl font-bold text-secondary">5,000+</div>
              <div className="text-sm text-primary-foreground/70">Daily Transactions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
            <div className="p-2 rounded-xl bg-primary">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-serif font-bold text-lg">HIMFED</div>
              <div className="text-xs text-muted-foreground">Smart Control System</div>
            </div>
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
              Sign in to your account
            </h2>
            <p className="text-muted-foreground">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Select Role
              </Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.code} value={role.code}>
                      <span className="font-mono text-xs text-muted-foreground mr-2">{role.code}</span>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Username
              </Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Enter your username" 
                className="h-12"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Password
              </Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me & forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full h-12">
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Need help? Contact{" "}
            <a href="mailto:support@bitdecentro.com" className="text-primary hover:underline">
              IT Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
