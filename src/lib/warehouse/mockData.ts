import { Area, ActivityLog, User, Warehouse, WarehouseEntry } from "./types";

export const areas: Area[] = [
  { id: "a1", code: "ARE-SHM", name: "Shimla", officerName: "Rajesh Verma", officerUserId: "u2", contact: "+91 98050 11111", status: "active", createdDate: "2024-01-10" },
  { id: "a2", code: "ARE-SOL", name: "Solan", officerName: "Anita Sharma", officerUserId: "u3", contact: "+91 98050 22222", status: "active", createdDate: "2024-01-12" },
  { id: "a3", code: "ARE-MND", name: "Mandi", officerName: "Vikram Thakur", officerUserId: "u4", contact: "+91 98050 33333", status: "active", createdDate: "2024-01-15" },
  { id: "a4", code: "ARE-KNG", name: "Kangra", officerName: "Sunita Devi", officerUserId: "u5", contact: "+91 98050 44444", status: "active", createdDate: "2024-01-18" },
];

export const warehouses: Warehouse[] = [
  { id: "w1", code: "WH-SHM-01", name: "Shimla Central Godown", areaId: "a1", address: "Sector 4, Shimla", capacity: 5000, inchargeName: "Manoj Kumar", contact: "+91 90000 11001", status: "active" },
  { id: "w2", code: "WH-SHM-02", name: "Theog Depot", areaId: "a1", address: "Theog, Shimla", capacity: 2500, inchargeName: "Suresh Negi", contact: "+91 90000 11002", status: "active" },
  { id: "w3", code: "WH-SOL-01", name: "Solan Main Warehouse", areaId: "a2", address: "Old Bus Stand, Solan", capacity: 4000, inchargeName: "Deepak Rana", contact: "+91 90000 22001", status: "active" },
  { id: "w4", code: "WH-SOL-02", name: "Nalagarh Storage", areaId: "a2", address: "Nalagarh Industrial Area", capacity: 3500, inchargeName: "Pooja Bhardwaj", contact: "+91 90000 22002", status: "maintenance" },
  { id: "w5", code: "WH-MND-01", name: "Mandi Regional Godown", areaId: "a3", address: "Sundernagar, Mandi", capacity: 6000, inchargeName: "Ramesh Sharma", contact: "+91 90000 33001", status: "active" },
  { id: "w6", code: "WH-KNG-01", name: "Kangra Depot", areaId: "a4", address: "Dharamshala Road, Kangra", capacity: 4500, inchargeName: "Kiran Chand", contact: "+91 90000 44001", status: "active" },
];

export const users: User[] = [
  { id: "u1", name: "System Administrator", email: "admin@himfed.in", phone: "+91 99999 00000", username: "superadmin", password: "admin123", role: "superadmin", status: "active" },
  { id: "u2", name: "Rajesh Verma", email: "rajesh.shimla@himfed.in", phone: "+91 98050 11111", username: "incharge.shimla", password: "shimla123", role: "incharge", areaId: "a1", status: "active" },
  { id: "u3", name: "Anita Sharma", email: "anita.solan@himfed.in", phone: "+91 98050 22222", username: "incharge.solan", password: "solan123", role: "incharge", areaId: "a2", status: "active" },
  { id: "u4", name: "Vikram Thakur", email: "vikram.mandi@himfed.in", phone: "+91 98050 33333", username: "incharge.mandi", password: "mandi123", role: "incharge", areaId: "a3", status: "active" },
  { id: "u5", name: "Sunita Devi", email: "sunita.kangra@himfed.in", phone: "+91 98050 44444", username: "incharge.kangra", password: "kangra123", role: "incharge", areaId: "a4", status: "active" },
  { id: "u6", name: "Manoj Kumar", email: "manoj.shm01@himfed.in", phone: "+91 90000 11001", username: "staff.shm01", password: "staff123", role: "warehouse_staff", areaId: "a1", warehouseId: "w1", status: "active" },
  { id: "u7", name: "Suresh Negi", email: "suresh.shm02@himfed.in", phone: "+91 90000 11002", username: "staff.shm02", password: "staff123", role: "warehouse_staff", areaId: "a1", warehouseId: "w2", status: "active" },
  { id: "u8", name: "Deepak Rana", email: "deepak.sol01@himfed.in", phone: "+91 90000 22001", username: "staff.sol01", password: "staff123", role: "warehouse_staff", areaId: "a2", warehouseId: "w3", status: "active" },
  { id: "u9", name: "Ramesh Sharma", email: "ramesh.mnd01@himfed.in", phone: "+91 90000 33001", username: "staff.mnd01", password: "staff123", role: "warehouse_staff", areaId: "a3", warehouseId: "w5", status: "active" },
  { id: "u10", name: "Kiran Chand", email: "kiran.kng01@himfed.in", phone: "+91 90000 44001", username: "staff.kng01", password: "staff123", role: "warehouse_staff", areaId: "a4", warehouseId: "w6", status: "active" },
  { id: "u11", name: "Neha Gupta", email: "neha.acc@himfed.in", phone: "+91 88880 00001", username: "accountant", password: "acct123", role: "accountant", status: "active" },
  { id: "u12", name: "Arjun Patel", email: "arjun.it@himfed.in", phone: "+91 88880 00002", username: "joa.it", password: "joait123", role: "joa_it", status: "active" },
];

export const entries: WarehouseEntry[] = [
  { id: "e1", entryCode: "ENT-2025-0001", depotDate: "2025-05-25", grNumber: "GR-784512", truckNumber: "HP-03-A-5421", quantity: 240, unit: "Bags", company: "NFL", productName: "Urea 50Kg", driverName: "Karam Singh", driverMobile: "+91 94567 12345", supplier: "NFL Panipat", warehouseId: "w1", areaId: "a1", remarks: "All bags intact. Sealed condition.", createdBy: "u6", createdAt: "2025-05-25T09:24:00", status: "approved", approvedBy: "u2", approvedAt: "2025-05-25T11:10:00", reviewRemarks: "Verified against challan." },
  { id: "e2", entryCode: "ENT-2025-0002", depotDate: "2025-05-25", grNumber: "GR-784533", truckNumber: "HP-13-B-1124", quantity: 180, unit: "Bags", company: "IFFCO", productName: "DAP 50Kg", driverName: "Rakesh Yadav", driverMobile: "+91 93456 22221", supplier: "IFFCO Kandla", warehouseId: "w1", areaId: "a1", remarks: "2 bags slightly torn — replaced.", createdBy: "u6", createdAt: "2025-05-26T08:05:00", status: "pending" },
  { id: "e3", entryCode: "ENT-2025-0003", depotDate: "2025-05-26", grNumber: "GR-784599", truckNumber: "HP-21-C-7890", quantity: 320, unit: "Bags", company: "KRIBHCO", productName: "NPK 12:32:16", driverName: "Mohan Lal", driverMobile: "+91 99880 11122", supplier: "KRIBHCO Hazira", warehouseId: "w3", areaId: "a2", remarks: "Bagged in 50kg PP bags.", createdBy: "u8", createdAt: "2025-05-26T10:42:00", status: "approved", approvedBy: "u3", approvedAt: "2025-05-26T14:20:00", reviewRemarks: "OK" },
  { id: "e4", entryCode: "ENT-2025-0004", depotDate: "2025-05-26", grNumber: "GR-784621", truckNumber: "HP-05-D-2233", quantity: 50, unit: "Quintal", company: "HIMFED", productName: "Wheat Seed Certified", driverName: "Pankaj Kumar", driverMobile: "+91 98221 76654", supplier: "Pant Nagar", warehouseId: "w5", areaId: "a3", remarks: "Stored in seed chamber.", createdBy: "u9", createdAt: "2025-05-26T13:15:00", status: "rejected", approvedBy: "u4", approvedAt: "2025-05-26T16:05:00", reviewRemarks: "GR number mismatch on physical copy. Resubmit." },
  { id: "e5", entryCode: "ENT-2025-0005", depotDate: "2025-05-27", grNumber: "GR-784644", truckNumber: "HP-37-E-4451", quantity: 12, unit: "Ton", company: "IOCL", productName: "Diesel HSD", driverName: "Sanjay Thakur", driverMobile: "+91 96543 00099", supplier: "IOCL Una Depot", warehouseId: "w6", areaId: "a4", remarks: "Tanker seal verified.", createdBy: "u10", createdAt: "2025-05-27T07:50:00", status: "pending" },
  { id: "e6", entryCode: "ENT-2025-0006", depotDate: "2025-05-27", grNumber: "GR-784667", truckNumber: "HP-03-F-9988", quantity: 400, unit: "Bags", company: "NFL", productName: "Urea 50Kg", driverName: "Inder Sharma", driverMobile: "+91 95678 44322", supplier: "NFL Bhatinda", warehouseId: "w2", areaId: "a1", remarks: "Unloaded in north shed.", createdBy: "u7", createdAt: "2025-05-27T09:30:00", status: "pending" },
  { id: "e7", entryCode: "ENT-2025-0007", depotDate: "2025-05-24", grNumber: "GR-784500", truckNumber: "HP-11-G-3322", quantity: 75, unit: "Quintal", company: "HIMFED", productName: "Apple Crates (Wooden)", driverName: "Hari Om", driverMobile: "+91 98760 11223", supplier: "Local Vendor — Kullu", warehouseId: "w1", areaId: "a1", remarks: "Stacked for distribution.", createdBy: "u6", createdAt: "2025-05-24T15:20:00", status: "approved", approvedBy: "u2", approvedAt: "2025-05-24T17:00:00", reviewRemarks: "Quality OK" },
  { id: "e8", entryCode: "ENT-2025-0008", depotDate: "2025-05-23", grNumber: "GR-784488", truckNumber: "HP-13-H-7766", quantity: 220, unit: "Bags", company: "Coromandel", productName: "Potash MOP 50Kg", driverName: "Vinod Saini", driverMobile: "+91 99110 22334", supplier: "Coromandel Vizag", warehouseId: "w3", areaId: "a2", remarks: "No damages.", createdBy: "u8", createdAt: "2025-05-23T11:00:00", status: "no_action" },
];

export const activityLogs: ActivityLog[] = [
  { id: "l1", user: "Manoj Kumar", role: "warehouse_staff", action: "Created Entry", target: "ENT-2025-0006", ip: "192.168.1.42", timestamp: "2025-05-27T09:30:00" },
  { id: "l2", user: "Rajesh Verma", role: "incharge", action: "Approved Entry", target: "ENT-2025-0001", ip: "192.168.1.15", timestamp: "2025-05-25T11:10:00" },
  { id: "l3", user: "Vikram Thakur", role: "incharge", action: "Rejected Entry", target: "ENT-2025-0004", ip: "192.168.1.78", timestamp: "2025-05-26T16:05:00" },
  { id: "l4", user: "System Administrator", role: "superadmin", action: "Login", ip: "10.0.0.1", timestamp: "2025-05-27T08:00:00" },
  { id: "l5", user: "Deepak Rana", role: "warehouse_staff", action: "Created Entry", target: "ENT-2025-0003", ip: "192.168.2.20", timestamp: "2025-05-26T10:42:00" },
  { id: "l6", user: "Anita Sharma", role: "incharge", action: "Approved Entry", target: "ENT-2025-0003", ip: "192.168.2.5", timestamp: "2025-05-26T14:20:00" },
  { id: "l7", user: "Kiran Chand", role: "warehouse_staff", action: "Created Entry", target: "ENT-2025-0005", ip: "192.168.4.11", timestamp: "2025-05-27T07:50:00" },
];
