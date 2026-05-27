export interface FertilizerCompany {
  id: string;
  code: string;
  name: string;
  gst: string;
  contactPerson: string;
  mobile: string;
  email: string;
  address: string;
  serviceAreas?: string[]; // areaIds this supplier serves
  status: "active" | "inactive";
}


export interface FertilizerProduct {
  id: string;
  code: string;
  name: string;
  companyId: string;
  unit: "Bag" | "Quintal" | "Kg" | "Ton";
  category: "Nitrogenous" | "Phosphatic" | "Potassic" | "Complex" | "Organic";
  status: "active" | "inactive";
}

export interface FertilizerPricing {
  id: string;
  productId: string;
  companyId: string;
  mrp: number;
  purchasePrice: number;
  sellingPrice: number;
  subsidy: number;
  effectiveDate: string;
  status: "active" | "inactive";
}

export type RequestStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "partially_approved"
  | "rejected";

export interface WarehouseAllocation {
  warehouseId: string;
  quantity: number;
}

export interface DemandRequest {
  id: string;
  requestCode: string;
  areaId: string;
  productId: string;
  companyId?: string; // preferred supplier chosen by area officer
  requestedQty: number;
  approvedQty?: number;
  priority: "Low" | "Medium" | "High" | "Urgent";
  requiredDate: string;
  remarks: string;
  status: RequestStatus;
  createdBy: string;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewRemarks?: string;
  allocations?: WarehouseAllocation[];
  forwardedPONumber?: string; // PO auto-generated to the supplier on approval
}


export type POStatus = "draft" | "sent" | "in_transit" | "delivered" | "closed";

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  companyId: string;
  productId: string;
  areaId: string;
  quantity: number;
  allocations: WarehouseAllocation[];
  deliveryInstructions: string;
  expectedDelivery: string;
  status: POStatus;
  requestId?: string;
  createdAt: string;
  createdBy: string;
}

export interface FertilizerStock {
  warehouseId: string;
  productId: string;
  companyId: string;
  quantity: number;
}
