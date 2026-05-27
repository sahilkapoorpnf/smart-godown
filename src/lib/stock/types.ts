export type StockEntryStatus = "pending" | "approved" | "rejected";

export interface DailyStockEntry {
  id: string;
  entryCode: string;
  areaId: string;
  warehouseId: string;
  depotDate: string;
  grNumber: string;
  truckNumber: string;
  companyId: string;
  productId: string;
  quantity: number;          // bags
  ratePerBag: number;
  totalAmount: number;
  driverName: string;
  remarks: string;
  receiptFile?: string;
  createdBy: string;
  createdAt: string;
  status: StockEntryStatus;
  approvedBy?: string;
  approvedAt?: string;
  reviewRemarks?: string;
}

export interface TaxConfig {
  productId: string;
  cgst: number;              // percent
  sgst: number;              // percent
  distributionMargin: number; // per bag, INR
}

export interface InvoiceLine {
  productId: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  financialYear: string;
  invoiceDate: string;
  customerName: string;
  customerGst: string;
  customerAddress: string;
  driverName?: string;
  areaId: string;
  warehouseId: string;
  lines: InvoiceLine[];
  subTotal: number;
  cgstAmount: number;
  sgstAmount: number;
  distributionMargin: number;
  roundOff: number;
  grandTotal: number;
  createdBy: string;
  createdAt: string;
}
