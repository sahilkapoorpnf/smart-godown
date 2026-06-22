import ErpPage, { Badge, fmtINR } from "@/components/erp/ErpPage";
import { DataTable } from "@/components/erp/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useErp, groupName } from "@/lib/erp/store";

export default function AccountingMasters() {
  const { groups, ledgers, voucherTypes } = useErp();

  return (
    <ErpPage allowed={["wh_accountant", "admin_accountant"]} title="Accounting Masters" description="Groups, Ledgers and Voucher Types — Tally-style chart of accounts.">
      <Tabs defaultValue="groups">
        <TabsList>
          <TabsTrigger value="groups">Group Master ({groups.length})</TabsTrigger>
          <TabsTrigger value="ledgers">Ledger Master ({ledgers.length})</TabsTrigger>
          <TabsTrigger value="vtypes">Voucher Types ({voucherTypes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="mt-4">
          <DataTable rows={groups} exportName="account-groups" searchKeys={["name", "under"] as any}
            columns={[
              { key: "name", label: "Group Name", sortable: true, render: (r) => <span className="font-semibold">{r.name}</span> },
              { key: "nature", label: "Nature", render: (r) => <Badge tone={r.nature === "Assets" ? "green" : r.nature === "Liabilities" ? "red" : r.nature === "Income" ? "blue" : "amber"}>{r.nature}</Badge> },
              { key: "under", label: "Under" },
            ]} />
        </TabsContent>

        <TabsContent value="ledgers" className="mt-4">
          <DataTable rows={ledgers} exportName="ledgers" searchKeys={["name", "gstin", "contact"] as any}
            columns={[
              { key: "name", label: "Ledger Name", sortable: true, render: (r) => <span className="font-semibold">{r.name}</span> },
              { key: "groupId", label: "Under Group", render: (r) => groupName(r.groupId) },
              { key: "gstin", label: "GSTIN", render: (r) => <span className="font-mono text-xs">{r.gstin ?? "—"}</span> },
              { key: "openingBalance", label: "Opening Balance", className: "text-right", render: (r) => <span className="font-mono">{fmtINR(r.openingBalance)} {r.type}</span> },
            ]} />
        </TabsContent>

        <TabsContent value="vtypes" className="mt-4">
          <DataTable rows={voucherTypes} exportName="voucher-types" searchKeys={["name", "category"] as any}
            columns={[
              { key: "name", label: "Voucher Type" },
              { key: "category", label: "Category", render: (r) => <Badge tone="blue">{r.category}</Badge> },
              { key: "prefix", label: "Numbering Prefix", render: (r) => <span className="font-mono">{r.prefix}</span> },
              { key: "numbering", label: "Numbering" },
            ]} />
        </TabsContent>
      </Tabs>
    </ErpPage>
  );
}
