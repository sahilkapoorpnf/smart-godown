import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { SALES, PURCHASES, CASH_BOOK, BANK_BOOK, downloadCSV } from "@/lib/accountant/data";
import { toast } from "sonner";

const exports = [
  {
    title: "Tally Sales Voucher Export",
    desc: "Sales vouchers in Tally-compatible Excel format",
    rows: () => SALES.map(s => ({
      Date: s.date, "Voucher Type": "Sales", "Voucher Number": s.invoiceNo,
      Party: s.party, "GST No": s.partyGst, Item: s.fertilizer, Qty: s.bags,
      Rate: s.rate, Amount: s.amount, CGST: s.cgst, SGST: s.sgst, "Net Amount": s.netAmount,
    })),
  },
  {
    title: "Tally Purchase Voucher Export",
    desc: "Purchase vouchers ready for Tally import",
    rows: () => PURCHASES.map(p => ({
      Date: p.date, "Voucher Type": "Purchase", "Voucher Number": p.grNo,
      Party: p.company, Item: p.fertilizer, Qty: p.bags, Rate: p.rate, Amount: p.amount,
    })),
  },
  {
    title: "Tally Ledger Export",
    desc: "All ledger accounts exportable to Tally",
    rows: () => [...CASH_BOOK.map(c => ({ Date: c.date, Voucher: c.voucher, Ledger: "Cash", Debit: c.debit, Credit: c.credit, Narration: c.particulars }))],
  },
  {
    title: "Tally GST Export",
    desc: "GSTR-1 compatible Tally Excel export",
    rows: () => SALES.map(s => ({
      "Invoice Date": s.date, "Invoice No": s.invoiceNo, "GSTIN/UIN": s.partyGst,
      "Party Name": s.party, "Taxable Value": s.amount, "CGST Rate": "2.5%", "CGST Amount": s.cgst,
      "SGST Rate": "2.5%", "SGST Amount": s.sgst, "Invoice Value": s.total,
    })),
  },
  {
    title: "Tally Bank Voucher Export",
    desc: "Bank receipts & payments in Tally format",
    rows: () => BANK_BOOK.map(b => ({
      Date: b.date, "Voucher Type": b.deposit ? "Receipt" : "Payment",
      "Bank Ledger": b.bank, "Voucher Number": b.utr, "Transaction Mode": b.txnType,
      Debit: b.deposit, Credit: b.withdrawal,
    })),
  },
];

export default function TallyExport() {
  return (
    <LedgerShell title="Tally Export Management" description="Export vouchers, ledgers, GST data in Tally-compatible Excel format." icon={Download}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exports.map(e => (
          <Card key={e.title}>
            <CardContent className="pt-6 space-y-3">
              <div>
                <h3 className="font-serif font-bold text-lg">{e.title}</h3>
                <p className="text-xs text-muted-foreground">{e.desc}</p>
              </div>
              <Button className="w-full" onClick={() => { downloadCSV(`tally-${e.title.replace(/\s+/g, "-").toLowerCase()}.csv`, e.rows()); toast.success("Tally export downloaded"); }}>
                <Download className="w-4 h-4 mr-2" />Download Tally Excel
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </LedgerShell>
  );
}
