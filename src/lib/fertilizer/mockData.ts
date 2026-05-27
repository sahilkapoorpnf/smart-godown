import {
  DemandRequest,
  FertilizerCompany,
  FertilizerPricing,
  FertilizerProduct,
  FertilizerStock,
  PurchaseOrder,
} from "./types";

export const companies: FertilizerCompany[] = [
  { id: "fc1", code: "NFL", name: "National Fertilizers Ltd.", gst: "06AAACN0917P1Z2", contactPerson: "Rakesh Mehta", mobile: "+91 98100 11111", email: "sales@nfl.co.in", address: "Noida, UP", status: "active" },
  { id: "fc2", code: "IFFCO", name: "Indian Farmers Fertiliser Cooperative", gst: "07AAAAI0140P1ZE", contactPerson: "Suman Joshi", mobile: "+91 98100 22222", email: "marketing@iffco.in", address: "New Delhi", status: "active" },
  { id: "fc3", code: "KRIBHCO", name: "Krishak Bharati Cooperative Ltd.", gst: "24AAACK6936P1Z0", contactPerson: "Pravin Patel", mobile: "+91 98100 33333", email: "info@kribhco.net", address: "Surat, Gujarat", status: "active" },
  { id: "fc4", code: "RCF", name: "Rashtriya Chemicals & Fertilizers", gst: "27AAACR1718Q1ZB", contactPerson: "Asha Naik", mobile: "+91 98100 44444", email: "contact@rcfltd.com", address: "Mumbai", status: "active" },
  { id: "fc5", code: "CHAMBAL", name: "Chambal Fertilizers & Chemicals", gst: "08AAACC4536R1Z0", contactPerson: "Vikas Saxena", mobile: "+91 98100 55555", email: "info@chambal.in", address: "Kota, Rajasthan", status: "active" },
  { id: "fc6", code: "COROMANDEL", name: "Coromandel International Ltd.", gst: "37AAACC4659P1ZH", contactPerson: "Rahul Reddy", mobile: "+91 98100 66666", email: "sales@coromandel.biz", address: "Secunderabad", status: "active" },
];

export const products: FertilizerProduct[] = [
  { id: "fp1", code: "UREA-50", name: "Urea 50Kg", companyId: "fc1", unit: "Bag", category: "Nitrogenous", status: "active" },
  { id: "fp2", code: "NCU-50", name: "Neem Coated Urea", companyId: "fc1", unit: "Bag", category: "Nitrogenous", status: "active" },
  { id: "fp3", code: "DAP-50", name: "DAP 50Kg", companyId: "fc2", unit: "Bag", category: "Phosphatic", status: "active" },
  { id: "fp4", code: "NPK-12-32-16", name: "NPK 12:32:16", companyId: "fc3", unit: "Bag", category: "Complex", status: "active" },
  { id: "fp5", code: "SSP-50", name: "SSP 50Kg", companyId: "fc4", unit: "Bag", category: "Phosphatic", status: "active" },
  { id: "fp6", code: "MOP-50", name: "MOP (Potash)", companyId: "fc6", unit: "Bag", category: "Potassic", status: "active" },
  { id: "fp7", code: "AS-50", name: "Ammonium Sulphate", companyId: "fc5", unit: "Bag", category: "Nitrogenous", status: "active" },
];

export const pricing: FertilizerPricing[] = [
  { id: "pr1", productId: "fp1", companyId: "fc1", mrp: 266.5, purchasePrice: 230, sellingPrice: 266.5, subsidy: 1850, effectiveDate: "2025-04-01", status: "active" },
  { id: "pr2", productId: "fp2", companyId: "fc1", mrp: 266.5, purchasePrice: 232, sellingPrice: 266.5, subsidy: 1880, effectiveDate: "2025-04-01", status: "active" },
  { id: "pr3", productId: "fp3", companyId: "fc2", mrp: 1350, purchasePrice: 1180, sellingPrice: 1350, subsidy: 2461, effectiveDate: "2025-04-01", status: "active" },
  { id: "pr4", productId: "fp4", companyId: "fc3", mrp: 1470, purchasePrice: 1290, sellingPrice: 1470, subsidy: 2100, effectiveDate: "2025-04-01", status: "active" },
  { id: "pr5", productId: "fp5", companyId: "fc4", mrp: 475, purchasePrice: 410, sellingPrice: 475, subsidy: 380, effectiveDate: "2025-04-01", status: "active" },
  { id: "pr6", productId: "fp6", companyId: "fc6", mrp: 1700, purchasePrice: 1520, sellingPrice: 1700, subsidy: 759, effectiveDate: "2025-04-01", status: "active" },
  { id: "pr7", productId: "fp7", companyId: "fc5", mrp: 970, purchasePrice: 870, sellingPrice: 970, subsidy: 600, effectiveDate: "2025-04-01", status: "active" },
];

export const requests: DemandRequest[] = [
  {
    id: "dr1", requestCode: "REQ-2025-0001", areaId: "a1", productId: "fp1",
    requestedQty: 1000, approvedQty: 400, priority: "High", requiredDate: "2025-06-05",
    remarks: "Pre-Kharif demand from Shimla apple belt.", status: "partially_approved",
    createdBy: "u2", createdAt: "2025-05-20T09:00:00",
    reviewedBy: "u1", reviewedAt: "2025-05-21T10:30:00",
    reviewRemarks: "Approved 400 bags as per current allocation.",
    allocations: [
      { warehouseId: "w1", quantity: 100 },
      { warehouseId: "w2", quantity: 100 },
      { warehouseId: "w1", quantity: 100 },
      { warehouseId: "w2", quantity: 100 },
    ],
  },
  {
    id: "dr2", requestCode: "REQ-2025-0002", areaId: "a2", productId: "fp3",
    requestedQty: 600, priority: "Medium", requiredDate: "2025-06-10",
    remarks: "DAP for Solan sowing.", status: "pending",
    createdBy: "u3", createdAt: "2025-05-22T11:15:00",
  },
  {
    id: "dr3", requestCode: "REQ-2025-0003", areaId: "a3", productId: "fp4",
    requestedQty: 450, approvedQty: 450, priority: "Urgent", requiredDate: "2025-06-02",
    remarks: "NPK for Mandi paddy nursery.", status: "approved",
    createdBy: "u4", createdAt: "2025-05-18T14:00:00",
    reviewedBy: "u1", reviewedAt: "2025-05-19T09:00:00", reviewRemarks: "Full quantity approved.",
    allocations: [{ warehouseId: "w5", quantity: 450 }],
  },
  {
    id: "dr4", requestCode: "REQ-2025-0004", areaId: "a4", productId: "fp6",
    requestedQty: 300, priority: "Low", requiredDate: "2025-06-15",
    remarks: "Kangra rabi top-up.", status: "under_review",
    createdBy: "u5", createdAt: "2025-05-24T10:20:00",
  },
  {
    id: "dr5", requestCode: "REQ-2025-0005", areaId: "a2", productId: "fp7",
    requestedQty: 200, priority: "Medium", requiredDate: "2025-05-30",
    remarks: "Stock running low.", status: "rejected",
    createdBy: "u3", createdAt: "2025-05-15T08:00:00",
    reviewedBy: "u1", reviewedAt: "2025-05-16T11:00:00",
    reviewRemarks: "Pending dues with company — request again next cycle.",
  },
];

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "po1", poNumber: "PO-2025-0001", companyId: "fc1", productId: "fp1",
    areaId: "a1", quantity: 400,
    allocations: [
      { warehouseId: "w1", quantity: 200 },
      { warehouseId: "w2", quantity: 200 },
    ],
    deliveryInstructions: "Deliver in two trucks. Unload at north shed.",
    expectedDelivery: "2025-06-03", status: "in_transit",
    requestId: "dr1", createdAt: "2025-05-22T09:00:00", createdBy: "u1",
  },
  {
    id: "po2", poNumber: "PO-2025-0002", companyId: "fc3", productId: "fp4",
    areaId: "a3", quantity: 450,
    allocations: [{ warehouseId: "w5", quantity: 450 }],
    deliveryInstructions: "Single truck dispatch.",
    expectedDelivery: "2025-05-29", status: "delivered",
    requestId: "dr3", createdAt: "2025-05-20T10:00:00", createdBy: "u1",
  },
  {
    id: "po3", poNumber: "PO-2025-0003", companyId: "fc2", productId: "fp3",
    areaId: "a2", quantity: 250,
    allocations: [{ warehouseId: "w3", quantity: 250 }],
    deliveryInstructions: "Priority dispatch.",
    expectedDelivery: "2025-06-08", status: "sent",
    createdAt: "2025-05-24T15:00:00", createdBy: "u1",
  },
];

// Computed stock from approved warehouse entries simulating live inventory
export const fertilizerStock: FertilizerStock[] = [
  { warehouseId: "w1", productId: "fp1", companyId: "fc1", quantity: 540 },
  { warehouseId: "w1", productId: "fp3", companyId: "fc2", quantity: 180 },
  { warehouseId: "w2", productId: "fp1", companyId: "fc1", quantity: 400 },
  { warehouseId: "w3", productId: "fp4", companyId: "fc3", quantity: 320 },
  { warehouseId: "w3", productId: "fp6", companyId: "fc6", quantity: 220 },
  { warehouseId: "w5", productId: "fp4", companyId: "fc3", quantity: 450 },
  { warehouseId: "w6", productId: "fp7", companyId: "fc5", quantity: 80 },
];
