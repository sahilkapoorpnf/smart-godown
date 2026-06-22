## HIMFED Tally-Style Multi-Area Accounting ERP — Implementation Plan

Rebuild the accountant ERP layer so each **Area = a Tally Company** containing multiple **Warehouses = Godowns**, with a company-selection gate after login and full Tally-style CRUD on every master, voucher, and report.

### 1. Data layer (`src/lib/erp/`)
Extend the existing ERP store (keep current types, add new ones):
- `AreaCompany` — id, name, code, address, district, state, pin, phone, email, gstType, gstNumber, pan, gstEffectiveDate, fyStart, fyEnd, booksFrom, currency, maintainAccounts, maintainInventory, status.
- `Group`, `Ledger`, `VoucherType`, `StockGroup`, `StockItem`, `StockUnit`, `Godown` (all scoped by `companyId`).
- `Voucher` (unified) — type: Purchase | Sales | Receipt | Payment | Journal | Contra | StockTransfer; lines with debit/credit; inventory lines with godownId, qty, rate, gst.
- `AuditEntry`, `DocumentRef`.
- Seed 2 Area Companies (**UNA Area**, **SHIMLA Area**) with 4 godowns each, 10+ ledgers, 10+ stock items, 30+ vouchers each, full audit trail. UNA gets realistic calculations (purchases → stock → sales → P&L).
- Selectors that derive Day Book, Trial Balance, P&L, Balance Sheet, Stock Summary, GST registers from vouchers.

### 2. Company selection gate
- New route `/dashboard/erp/select-company` — shown after login for `wh_accountant` / `admin_accountant`.
- Persist `activeCompanyId` in store + localStorage. All ERP pages read from it; show company switcher in the ERP header.
- Admin Accountant sees all companies; Warehouse Accountant only assigned ones.

### 3. New pages (`src/pages/erp/accountant/`)
Reusable `MasterCrudPage` + `VoucherFormPage` components to keep this compact.

**Masters**
- `CompanyInformation.tsx`, `CompanyList.tsx` (CRUD, block delete if vouchers exist)
- `GroupMaster.tsx`, `LedgerMaster.tsx`, `VoucherTypeMaster.tsx`
- `StockGroupMaster.tsx`, `StockItemMaster.tsx`, `StockUnitMaster.tsx`, `GodownMaster.tsx`

**Vouchers** (each: list + create/edit modal, auto Day Book + ledger + stock updates)
- `PurchaseVoucher.tsx` (pulls from approved Goods Arrivals)
- `SalesVoucher.tsx`, `ReceiptVoucher.tsx`, `PaymentVoucher.tsx`
- `JournalVoucher.tsx`, `ContraVoucher.tsx`, `StockTransferVoucher.tsx`

**Day Book & Reports**
- `DayBookTally.tsx` (date/type/ledger/godown filters)
- `LedgerReport.tsx`, `TrialBalance.tsx`, `CashBook.tsx`, `BankBook.tsx`
- `PurchaseRegister.tsx`, `SalesRegister.tsx`
- `StockSummary.tsx`, `StockRegister.tsx`, `GodownStock.tsx`
- `GstReports.tsx`, `ProfitLoss.tsx`, `BalanceSheet.tsx`
- `Documents.tsx`, `AuditLogs.tsx`

### 4. Routing & Sidebar
- Register all routes under `/dashboard/erp/acc/*` in `App.tsx`.
- Add a grouped Tally-style sidebar section (Dashboard, Company, Masters, Inventory Masters, Transactions, Day Book, Reports, Documents, Audit) gated to `wh_accountant`, `admin_accountant`, `accountant`, `superadmin`.
- `Dashboard.tsx` redirects accountants to company-select if no active company, else to the Tally dashboard.

### 5. Dashboard
`TallyDashboard.tsx` — Today's Purchase/Sales, Stock Value, Cash, Bank, Receivables, Payables, Pending Vouchers/Approvals, all derived from the active company's vouchers.

### 6. Non-goals (preserved as-is)
- Existing fertilizer/sales/stock/warehouse modules unchanged.
- Existing roles, login flow, and other dashboards unchanged.
- No backend — pure in-memory store with seeded data.

### Technical notes
- Single source of truth: voucher list → all reports computed via selectors (no duplicated state).
- Stock movement = sum of inventory lines across Purchase (+), Sales (−), StockTransfer (± per godown).
- Day Book = chronological voucher list flattened by ledger lines.
- Trial Balance / P&L / Balance Sheet derived from ledger group classification.

Approve and I'll build it.
