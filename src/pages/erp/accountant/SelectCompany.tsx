import { useNavigate } from "react-router-dom";
import ErpPage, { StatTile, fmtINR } from "@/components/erp/ErpPage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Phone, Mail, ArrowRight, Plus } from "lucide-react";
import { useErp, setActiveCompany, companiesForUser, vouchersForCompany, godownsForCompany } from "@/lib/erp/store";
import { getCurrentUser } from "@/lib/warehouse/store";

export default function SelectCompany() {
  useErp();
  const user = getCurrentUser();
  const nav = useNavigate();
  const list = companiesForUser(user?.id, user?.role);

  const pick = (id: string) => { setActiveCompany(id); nav("/dashboard/erp/acc/company-info"); };
  const openInfo = (id: string) => { setActiveCompany(id); nav("/dashboard/erp/acc/company-info"); };
  const openWorkspace = (id: string) => { setActiveCompany(id); nav("/dashboard/erp/acc"); };

  return (
    <ErpPage
      allowed={["wh_accountant", "admin_accountant", "accountant", "superadmin"]}
      title="Select Area Company"
      description="Choose the area company (Tally company) you want to work in. Each area maintains its own books, GST, and inventory."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => nav("/dashboard/erp/acc/companies")}><Plus className="w-4 h-4 mr-2" />Create / Manage Companies</Button>
        </div>
      }
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c) => {
          const vs = vouchersForCompany(c.id);
          const gs = godownsForCompany(c.id);
          const totalSales = vs.filter((v) => v.kind === "sales").reduce((s, v) => s + v.grandTotal, 0);
          const totalPurchases = vs.filter((v) => v.kind === "purchase").reduce((s, v) => s + v.grandTotal, 0);
          return (
            <Card key={c.id} className="hover:shadow-lg transition-shadow border-himfed-green/20">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-himfed-green/10"><Building2 className="w-6 h-6 text-himfed-green" /></div>
                  <div className="flex-1">
                    <div className="font-serif font-bold text-lg">{c.name}</div>
                    <div className="text-xs text-muted-foreground">Code: {c.code} · GSTIN: {c.gstNumber}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{c.address}, {c.district}</div>
                  <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{c.phone}</div>
                  <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{c.email}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded bg-muted/50"><div className="text-xs text-muted-foreground">Godowns</div><div className="font-bold">{gs.length}</div></div>
                  <div className="p-2 rounded bg-muted/50"><div className="text-xs text-muted-foreground">Vouchers</div><div className="font-bold">{vs.length}</div></div>
                  <div className="p-2 rounded bg-muted/50"><div className="text-xs text-muted-foreground">Sales</div><div className="font-bold text-himfed-green text-xs">{fmtINR(totalSales)}</div></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => openInfo(c.id)}>View / Edit</Button>
                  <Button onClick={() => pick(c.id)}>Open <ArrowRight className="w-4 h-4 ml-1" /></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {list.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No companies assigned to your account.</div>
      )}
    </ErpPage>
  );
}
