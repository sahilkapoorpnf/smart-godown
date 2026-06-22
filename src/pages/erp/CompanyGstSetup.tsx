import { useState } from "react";
import ErpPage from "@/components/erp/ErpPage";
import { DataTable } from "@/components/erp/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useErp, groupName } from "@/lib/erp/store";

export default function CompanyGstSetup() {
  const { groups, ledgers } = useErp();
  const [company] = useState({
    name: "HIMFED — HP State Cooperative Marketing & Consumers Federation Ltd.",
    address: "HIMFED Bhawan, Sector 2, New Shimla, HP 171009",
    gstin: "02AABCH1234M1ZP",
    pan: "AABCH1234M",
    fy: "2026-27 (1 Apr 2026 – 31 Mar 2027)",
    state: "Himachal Pradesh (02)",
    contact: "+91 177 2670012",
    email: "accounts@himfed.in",
  });

  const gstRates = [
    { hsn: "31021000", desc: "Urea Fertilizer", cgst: 2.5, sgst: 2.5, igst: 5 },
    { hsn: "31053000", desc: "DAP Fertilizer", cgst: 2.5, sgst: 2.5, igst: 5 },
    { hsn: "31052000", desc: "NPK Complex", cgst: 2.5, sgst: 2.5, igst: 5 },
    { hsn: "31042000", desc: "Potash MOP", cgst: 2.5, sgst: 2.5, igst: 5 },
    { hsn: "10019910", desc: "Wheat Seed (Certified)", cgst: 0, sgst: 0, igst: 0 },
    { hsn: "44152000", desc: "Wooden Crates", cgst: 6, sgst: 6, igst: 12 },
    { hsn: "27101930", desc: "Diesel HSD", cgst: 0, sgst: 0, igst: 0 },
  ];

  return (
    <ErpPage allowed={["wh_accountant", "admin_accountant"]} title="Company & GST Setup" description="Company profile, GST registration and tax configuration.">
      <Tabs defaultValue="company">
        <TabsList><TabsTrigger value="company">Company Profile</TabsTrigger><TabsTrigger value="gst">GST / HSN Master</TabsTrigger></TabsList>

        <TabsContent value="company" className="mt-4">
          <Card><CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(company).map(([k, v]) => (
              <div key={k} className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase">{k}</Label>
                <Input value={v} readOnly className="bg-muted/30" />
              </div>
            ))}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="gst" className="mt-4">
          <DataTable
            rows={gstRates} exportName="gst-master"
            searchKeys={["hsn", "desc"] as any}
            columns={[
              { key: "hsn", label: "HSN/SAC", render: (r) => <span className="font-mono">{r.hsn}</span> },
              { key: "desc", label: "Description" },
              { key: "cgst", label: "CGST %", render: (r) => `${r.cgst}%` },
              { key: "sgst", label: "SGST %", render: (r) => `${r.sgst}%` },
              { key: "igst", label: "IGST %", render: (r) => `${r.igst}%` },
            ]}
          />
        </TabsContent>
      </Tabs>
    </ErpPage>
  );
}
