import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Building2, Bell, Mail, Globe, Clock, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SystemConfiguration = () => {
  const { toast } = useToast();
  
  const [generalSettings, setGeneralSettings] = useState({
    organizationName: "HIMFED",
    organizationFullName: "Himachal Pradesh State Cooperative Supply & Marketing Federation Ltd.",
    registrationNumber: "HIMFED-2024-001",
    gstNumber: "02AABCT1332L2ZN",
    panNumber: "AABCT1332L",
    address: "Bus Stand, Cart Road, Shimla - 171001, Himachal Pradesh",
    phone: "+91 177 265 8100",
    email: "info@himfed.com",
    website: "www.himfed.com",
    financialYearStart: "April",
    currency: "INR",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    stockAlerts: true,
    stockThreshold: "20",
    transferNotifications: true,
    approvalReminders: true,
    dailyReports: true,
    weeklyReports: true,
    expiryAlertDays: "30",
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    passwordExpiry: "90",
    minPasswordLength: "8",
    requireSpecialChar: true,
    requireNumbers: true,
    twoFactorAuth: false,
    ipRestriction: false,
    allowedIPs: "",
  });

  const handleSaveGeneral = () => {
    toast({ title: "General settings saved successfully" });
  };

  const handleSaveNotifications = () => {
    toast({ title: "Notification settings saved successfully" });
  };

  const handleSaveSecurity = () => {
    toast({ title: "Security settings saved successfully" });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <PageHeader
              title="System Configuration"
              description="Configure global system settings and preferences"
              icon={Settings}
            />

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Organization
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              {/* General Settings Tab */}
              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Organization Details</CardTitle>
                    <CardDescription>Basic information about your organization</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Organization Name</Label>
                        <Input
                          value={generalSettings.organizationName}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, organizationName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Full Legal Name</Label>
                        <Input
                          value={generalSettings.organizationFullName}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, organizationFullName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Registration Number</Label>
                        <Input
                          value={generalSettings.registrationNumber}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, registrationNumber: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GST Number</Label>
                        <Input
                          value={generalSettings.gstNumber}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, gstNumber: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>PAN Number</Label>
                        <Input
                          value={generalSettings.panNumber}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, panNumber: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={generalSettings.phone}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={generalSettings.email}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Website</Label>
                        <Input
                          value={generalSettings.website}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, website: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea
                        value={generalSettings.address}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Regional Settings</CardTitle>
                    <CardDescription>Configure date, time, and currency formats</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Financial Year Start</Label>
                        <Select
                          value={generalSettings.financialYearStart}
                          onValueChange={(value) => setGeneralSettings({ ...generalSettings, financialYearStart: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="January">January</SelectItem>
                            <SelectItem value="April">April</SelectItem>
                            <SelectItem value="July">July</SelectItem>
                            <SelectItem value="October">October</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select
                          value={generalSettings.currency}
                          onValueChange={(value) => setGeneralSettings({ ...generalSettings, currency: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                            <SelectItem value="USD">USD ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Select
                          value={generalSettings.timezone}
                          onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Date Format</Label>
                        <Select
                          value={generalSettings.dateFormat}
                          onValueChange={(value) => setGeneralSettings({ ...generalSettings, dateFormat: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button onClick={handleSaveGeneral}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Channels</CardTitle>
                    <CardDescription>Configure how notifications are delivered</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Send notifications via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Send critical alerts via SMS</p>
                      </div>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsNotifications: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alert Settings</CardTitle>
                    <CardDescription>Configure when and how alerts are triggered</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Stock Alerts</p>
                        <p className="text-sm text-muted-foreground">Notify when stock falls below threshold</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          value={notificationSettings.stockThreshold}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, stockThreshold: e.target.value })}
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                        <Switch
                          checked={notificationSettings.stockAlerts}
                          onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, stockAlerts: checked })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Expiry Alerts</p>
                        <p className="text-sm text-muted-foreground">Alert days before product expiry</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          value={notificationSettings.expiryAlertDays}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, expiryAlertDays: e.target.value })}
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">days</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Transfer Notifications</p>
                        <p className="text-sm text-muted-foreground">Notify on stock transfer events</p>
                      </div>
                      <Switch
                        checked={notificationSettings.transferNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, transferNotifications: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Approval Reminders</p>
                        <p className="text-sm text-muted-foreground">Send reminders for pending approvals</p>
                      </div>
                      <Switch
                        checked={notificationSettings.approvalReminders}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, approvalReminders: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Report Schedule</CardTitle>
                    <CardDescription>Configure automated report generation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Daily Reports</p>
                        <p className="text-sm text-muted-foreground">Generate daily stock summary</p>
                      </div>
                      <Switch
                        checked={notificationSettings.dailyReports}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, dailyReports: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-muted-foreground">Generate weekly performance report</p>
                      </div>
                      <Switch
                        checked={notificationSettings.weeklyReports}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, weeklyReports: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button onClick={handleSaveNotifications}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Session Management</CardTitle>
                    <CardDescription>Configure session and login settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Session Timeout (minutes)</Label>
                        <Input
                          type="number"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Login Attempts</Label>
                        <Input
                          type="number"
                          value={securitySettings.maxLoginAttempts}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Password Policy</CardTitle>
                    <CardDescription>Define password requirements for all users</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Password Expiry (days)</Label>
                        <Input
                          type="number"
                          value={securitySettings.passwordExpiry}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Minimum Password Length</Label>
                        <Input
                          type="number"
                          value={securitySettings.minPasswordLength}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, minPasswordLength: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Require Special Characters</p>
                        <p className="text-sm text-muted-foreground">Password must contain @, #, $, etc.</p>
                      </div>
                      <Switch
                        checked={securitySettings.requireSpecialChar}
                        onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, requireSpecialChar: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Require Numbers</p>
                        <p className="text-sm text-muted-foreground">Password must contain numeric digits</p>
                      </div>
                      <Switch
                        checked={securitySettings.requireNumbers}
                        onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, requireNumbers: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Security</CardTitle>
                    <CardDescription>Additional security measures</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">IP Address Restriction</p>
                        <p className="text-sm text-muted-foreground">Only allow access from specific IPs</p>
                      </div>
                      <Switch
                        checked={securitySettings.ipRestriction}
                        onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, ipRestriction: checked })}
                      />
                    </div>
                    {securitySettings.ipRestriction && (
                      <div className="space-y-2">
                        <Label>Allowed IP Addresses (comma separated)</Label>
                        <Textarea
                          value={securitySettings.allowedIPs}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, allowedIPs: e.target.value })}
                          placeholder="192.168.1.1, 10.0.0.1"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button onClick={handleSaveSecurity}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemConfiguration;
