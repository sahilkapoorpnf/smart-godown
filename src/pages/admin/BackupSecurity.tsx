import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Database,
  Download,
  Upload,
  Clock,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Lock,
  Key,
  UserCheck,
  Activity,
  FileArchive,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BackupRecord {
  id: string;
  name: string;
  type: "Full" | "Incremental" | "Differential";
  size: string;
  createdAt: string;
  status: "success" | "warning" | "error";
  duration: string;
  retentionDays: number;
}

interface SecurityLog {
  id: string;
  event: string;
  user: string;
  ipAddress: string;
  timestamp: string;
  status: "success" | "warning" | "error";
  details: string;
}

const mockBackups: BackupRecord[] = [
  { id: "1", name: "Full_Backup_20240114", type: "Full", size: "2.4 GB", createdAt: "2024-01-14 02:00 AM", status: "success", duration: "45 min", retentionDays: 30 },
  { id: "2", name: "Incremental_20240113", type: "Incremental", size: "156 MB", createdAt: "2024-01-13 02:00 AM", status: "success", duration: "8 min", retentionDays: 7 },
  { id: "3", name: "Incremental_20240112", type: "Incremental", size: "234 MB", createdAt: "2024-01-12 02:00 AM", status: "success", duration: "12 min", retentionDays: 7 },
  { id: "4", name: "Incremental_20240111", type: "Incremental", size: "89 MB", createdAt: "2024-01-11 02:00 AM", status: "warning", duration: "15 min", retentionDays: 7 },
  { id: "5", name: "Full_Backup_20240107", type: "Full", size: "2.3 GB", createdAt: "2024-01-07 02:00 AM", status: "success", duration: "42 min", retentionDays: 30 },
  { id: "6", name: "Differential_20240110", type: "Differential", size: "512 MB", createdAt: "2024-01-10 02:00 AM", status: "success", duration: "18 min", retentionDays: 14 },
];

const mockSecurityLogs: SecurityLog[] = [
  { id: "1", event: "Login Success", user: "rajesh.kumar@himfed.com", ipAddress: "192.168.1.45", timestamp: "2024-01-14 10:30 AM", status: "success", details: "Chrome browser on Windows" },
  { id: "2", event: "Password Changed", user: "priya.sharma@himfed.com", ipAddress: "192.168.1.52", timestamp: "2024-01-14 09:45 AM", status: "success", details: "Password updated successfully" },
  { id: "3", event: "Failed Login Attempt", user: "unknown@test.com", ipAddress: "203.45.67.89", timestamp: "2024-01-14 08:22 AM", status: "error", details: "Invalid credentials - 3rd attempt" },
  { id: "4", event: "Role Modified", user: "admin@himfed.com", ipAddress: "192.168.1.10", timestamp: "2024-01-13 04:30 PM", status: "warning", details: "Changed role from WS to WM for user ID #45" },
  { id: "5", event: "New User Created", user: "rajesh.kumar@himfed.com", ipAddress: "192.168.1.45", timestamp: "2024-01-13 02:15 PM", status: "success", details: "Created user: amit.thakur@himfed.com" },
  { id: "6", event: "Export Data", user: "suresh.negi@himfed.com", ipAddress: "192.168.1.78", timestamp: "2024-01-13 11:00 AM", status: "success", details: "Exported stock report (PDF)" },
  { id: "7", event: "Session Timeout", user: "kavita.bhatt@himfed.com", ipAddress: "192.168.1.33", timestamp: "2024-01-12 06:45 PM", status: "warning", details: "Session expired after 30 min inactivity" },
  { id: "8", event: "Account Locked", user: "test.user@himfed.com", ipAddress: "45.67.89.12", timestamp: "2024-01-12 03:20 PM", status: "error", details: "Locked after 5 failed login attempts" },
];

const BackupSecurity = () => {
  const { toast } = useToast();
  const [backups, setBackups] = useState<BackupRecord[]>(mockBackups);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupTime: "02:00",
    backupFrequency: "daily",
    retentionDays: "30",
    includeMedia: true,
    encryptBackups: true,
    cloudBackup: true,
    notifyOnComplete: true,
  });

  const backupColumns: Column<BackupRecord>[] = [
    {
      key: "name",
      label: "Backup Name",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <FileArchive className="w-4 h-4 text-primary" />
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    { key: "type", label: "Type", sortable: true },
    { key: "size", label: "Size" },
    { key: "createdAt", label: "Created", sortable: true },
    { key: "duration", label: "Duration" },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  const securityLogColumns: Column<SecurityLog>[] = [
    {
      key: "event",
      label: "Event",
      sortable: true,
      render: (item) => {
        const iconMap: Record<string, React.ReactNode> = {
          "Login Success": <UserCheck className="w-4 h-4 text-himfed-success" />,
          "Failed Login Attempt": <AlertTriangle className="w-4 h-4 text-himfed-danger" />,
          "Password Changed": <Key className="w-4 h-4 text-primary" />,
          "Account Locked": <Lock className="w-4 h-4 text-himfed-danger" />,
          default: <Activity className="w-4 h-4 text-muted-foreground" />,
        };
        return (
          <div className="flex items-center gap-2">
            {iconMap[item.event] || iconMap.default}
            <span>{item.event}</span>
          </div>
        );
      },
    },
    { key: "user", label: "User", sortable: true },
    { key: "ipAddress", label: "IP Address" },
    { key: "timestamp", label: "Timestamp", sortable: true },
    { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "details", label: "Details", className: "max-w-[200px] truncate" },
  ];

  const handleManualBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          const newBackup: BackupRecord = {
            id: String(Date.now()),
            name: `Manual_Backup_${new Date().toISOString().split("T")[0].replace(/-/g, "")}`,
            type: "Full",
            size: "2.5 GB",
            createdAt: new Date().toLocaleString(),
            status: "success",
            duration: "48 min",
            retentionDays: 30,
          };
          setBackups([newBackup, ...backups]);
          toast({ title: "Backup completed successfully!" });
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const handleRestoreBackup = (backup: BackupRecord) => {
    toast({ title: `Restoring from ${backup.name}...`, description: "This may take several minutes." });
  };

  const handleDeleteBackup = (backup: BackupRecord) => {
    setBackups(backups.filter((b) => b.id !== backup.id));
    toast({ title: "Backup deleted", variant: "destructive" });
  };

  const handleDownloadBackup = (backup: BackupRecord) => {
    toast({ title: `Downloading ${backup.name}...` });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <PageHeader
              title="Backup & Security"
              description="Manage system backups, security logs, and data protection"
              icon={Shield}
            />

            <Tabs defaultValue="backups" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="backups" className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Backups
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Schedule
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security Logs
                </TabsTrigger>
              </TabsList>

              {/* Backups Tab */}
              <TabsContent value="backups" className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Backups</p>
                          <p className="text-2xl font-bold">{backups.length}</p>
                        </div>
                        <Database className="w-8 h-8 text-primary/20" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Storage Used</p>
                          <p className="text-2xl font-bold">8.2 GB</p>
                        </div>
                        <HardDrive className="w-8 h-8 text-himfed-warning/20" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Last Backup</p>
                          <p className="text-2xl font-bold">2h ago</p>
                        </div>
                        <Clock className="w-8 h-8 text-himfed-success/20" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Success Rate</p>
                          <p className="text-2xl font-bold text-himfed-success">98%</p>
                        </div>
                        <CheckCircle2 className="w-8 h-8 text-himfed-success/20" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Manual Backup Button */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Create Manual Backup</h3>
                        <p className="text-sm text-muted-foreground">Create a full system backup now</p>
                      </div>
                      <Button onClick={handleManualBackup} disabled={isBackingUp}>
                        {isBackingUp ? (
                          <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Backing up...</>
                        ) : (
                          <><Database className="w-4 h-4 mr-2" />Create Backup</>
                        )}
                      </Button>
                    </div>
                    {isBackingUp && (
                      <div className="mt-4">
                        <Progress value={backupProgress} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-2">{backupProgress}% complete</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Backup List */}
                <DataTable
                  data={backups}
                  columns={backupColumns}
                  searchPlaceholder="Search backups..."
                  searchKey="name"
                  showExport={false}
                  actions={(item) => (
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadBackup(item)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleRestoreBackup(item)}>
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteBackup(item)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                />
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Automatic Backup Schedule</CardTitle>
                    <CardDescription>Configure when and how backups are created</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable Automatic Backups</p>
                        <p className="text-sm text-muted-foreground">Automatically create backups based on schedule</p>
                      </div>
                      <Switch
                        checked={backupSettings.autoBackup}
                        onCheckedChange={(checked) => setBackupSettings({ ...backupSettings, autoBackup: checked })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Backup Time</label>
                        <Select value={backupSettings.backupTime} onValueChange={(v) => setBackupSettings({ ...backupSettings, backupTime: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="00:00">12:00 AM</SelectItem>
                            <SelectItem value="02:00">2:00 AM</SelectItem>
                            <SelectItem value="04:00">4:00 AM</SelectItem>
                            <SelectItem value="06:00">6:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Frequency</label>
                        <Select value={backupSettings.backupFrequency} onValueChange={(v) => setBackupSettings({ ...backupSettings, backupFrequency: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Retention Period</label>
                        <Select value={backupSettings.retentionDays} onValueChange={(v) => setBackupSettings({ ...backupSettings, retentionDays: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 Days</SelectItem>
                            <SelectItem value="14">14 Days</SelectItem>
                            <SelectItem value="30">30 Days</SelectItem>
                            <SelectItem value="90">90 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Backup Options</CardTitle>
                    <CardDescription>Additional backup configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Include Media Files</p>
                        <p className="text-sm text-muted-foreground">Include uploaded images and documents</p>
                      </div>
                      <Switch
                        checked={backupSettings.includeMedia}
                        onCheckedChange={(checked) => setBackupSettings({ ...backupSettings, includeMedia: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Encrypt Backups</p>
                        <p className="text-sm text-muted-foreground">Use AES-256 encryption for backup files</p>
                      </div>
                      <Switch
                        checked={backupSettings.encryptBackups}
                        onCheckedChange={(checked) => setBackupSettings({ ...backupSettings, encryptBackups: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Cloud Backup</p>
                        <p className="text-sm text-muted-foreground">Store backup copies in cloud storage</p>
                      </div>
                      <Switch
                        checked={backupSettings.cloudBackup}
                        onCheckedChange={(checked) => setBackupSettings({ ...backupSettings, cloudBackup: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Send email when backup completes</p>
                      </div>
                      <Switch
                        checked={backupSettings.notifyOnComplete}
                        onCheckedChange={(checked) => setBackupSettings({ ...backupSettings, notifyOnComplete: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={() => toast({ title: "Backup settings saved" })}>
                    Save Settings
                  </Button>
                </div>
              </TabsContent>

              {/* Security Logs Tab */}
              <TabsContent value="security" className="space-y-6">
                <DataTable
                  data={mockSecurityLogs}
                  columns={securityLogColumns}
                  searchPlaceholder="Search security logs..."
                  searchKey="event"
                  pageSize={8}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BackupSecurity;
