import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Lock, User, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login, loginAs, store } from "@/lib/warehouse/store";
import { ROLE_LABEL } from "@/lib/warehouse/types";
import { toast } from "sonner";

const quickAccounts = [
  { id: "wu_una1", label: "WH User — Una",            color: "bg-himfed-green text-white" },
  { id: "ao_una",  label: "Area Officer — Una",       color: "bg-himfed-amber text-foreground" },
  { id: "wa_una",  label: "Warehouse Accountant",     color: "bg-himfed-info/90 text-white" },
  { id: "aa_hq",   label: "Admin Accountant (HQ)",    color: "bg-destructive text-white" },
  { id: "u1",      label: "Superadmin",               color: "bg-primary text-primary-foreground" },
  { id: "u11",     label: "Accountant (legacy)",      color: "bg-secondary text-secondary-foreground" },
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const routeFor = (role: string) => {
    if (role === "warehouse_staff") return "/dashboard";
    if (role === "incharge") return "/dashboard/wh/approvals";
    if (role === "wh_user") return "/dashboard/erp/wh";
    if (role === "area_officer") return "/dashboard/erp/ao/pending";
    if (role === "wh_accountant") return "/dashboard/erp/acc";
    if (role === "admin_accountant") return "/dashboard/erp/admin";
    return "/dashboard";
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = login(username.trim(), password);
    if (!u) {
      toast.error("Invalid credentials. Try a demo account below.");
      return;
    }
    toast.success(`Welcome, ${u.name}`);
    navigate(routeFor(u.role));
  };

  const quickLogin = (id: string) => {
    const u = loginAs(id);
    if (u) {
      toast.success(`Logged in as ${u.name}`);
      navigate(routeFor(u.role));
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 grain-texture pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 -left-10 w-60 h-60 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 flex flex-col justify-center p-16 text-primary-foreground">
          <Link to="/" className="inline-flex items-center gap-3 mb-12">
            <div className="p-3 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm">
              <Leaf className="w-8 h-8" />
            </div>
            <div>
              <div className="font-serif font-bold text-2xl">HIMFED</div>
              <div className="text-sm text-primary-foreground/70">Warehouse Control System</div>
            </div>
          </Link>

          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Sign in to your
            <span className="block text-secondary">Workspace</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md mb-12">
            Role-based access for Warehouse Staff, Area Incharge, Accountants and Administrators.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <div className="text-3xl font-bold text-secondary">{store.warehouses.length}</div>
              <div className="text-sm text-primary-foreground/70">Warehouses Connected</div>
            </div>
            <div className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <div className="text-3xl font-bold text-secondary">{store.entries.length}</div>
              <div className="text-sm text-primary-foreground/70">Inventory Entries</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
            <div className="p-2 rounded-xl bg-primary">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-serif font-bold text-lg">HIMFED</div>
              <div className="text-xs text-muted-foreground">Warehouse Control System</div>
            </div>
          </Link>

          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
              Sign in to your account
            </h2>
            <p className="text-muted-foreground">
              Enter your username and password — or use a demo account below.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" /> Username
              </Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. staff.shm01" className="h-12" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" /> Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <Button type="submit" size="lg" className="w-full h-12">
              Sign In
            </Button>
          </form>

          <div className="mt-8">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">
              Quick Demo Logins
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickAccounts.map((q) => {
                const u = store.users.find((x) => x.id === q.id)!;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => quickLogin(q.id)}
                    className="text-left p-3 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all bg-card"
                  >
                    <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${q.color} mb-1.5`}>
                      {ROLE_LABEL[u.role]}
                    </div>
                    <div className="text-sm font-medium text-foreground truncate">{u.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{u.username}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo passwords: superadmin=<code>admin123</code> · staff=<code>staff123</code> · incharge=<code>{"<area>"}123</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
