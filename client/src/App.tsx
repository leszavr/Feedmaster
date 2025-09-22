import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AdminLayout from "@/pages/admin/layout";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users";
import AdminBots from "@/pages/admin/bots";
import AdminActivity from "@/pages/admin/activity";
import AdminBilling from "@/pages/admin/billing";
import AdminSystem from "@/pages/admin/system";
import AdminSupport from "@/pages/admin/support";
import AdminSettings from "@/pages/admin/settings";

function Router() {
  return (
    <Switch>
      {/* Admin Routes - Isolated Group */}
      <Route path="/admin" component={() => <AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/dashboard" component={() => <AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/users" component={() => <AdminLayout><AdminUsers /></AdminLayout>} />
      <Route path="/admin/bots" component={() => <AdminLayout><AdminBots /></AdminLayout>} />
      <Route path="/admin/activity" component={() => <AdminLayout><AdminActivity /></AdminLayout>} />
      <Route path="/admin/billing" component={() => <AdminLayout><AdminBilling /></AdminLayout>} />
      <Route path="/admin/system" component={() => <AdminLayout><AdminSystem /></AdminLayout>} />
      <Route path="/admin/support" component={() => <AdminLayout><AdminSupport /></AdminLayout>} />
      <Route path="/admin/settings" component={() => <AdminLayout><AdminSettings /></AdminLayout>} />
      {/* Add non-admin pages here */}
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
