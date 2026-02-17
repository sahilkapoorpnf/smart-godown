import { ArrowRight, CheckCircle2, Clock, Users } from "lucide-react";

const workflows = [
  { activity: "Purchase Order", flow: ["PM", "HQ"], description: "Procurement Manager creates, HQ Admin approves" },
  { activity: "Godown Receipt", flow: ["WS", "WM", "AO"], description: "Staff scans, Manager verifies, Area Office confirms" },
  { activity: "Stock Transfer", flow: ["AO", "HQ"], description: "Area Office requests, Head Office authorizes" },
  { activity: "Petrol Credit", flow: ["FM", "FA"], description: "Fuel Manager issues, Finance Officer reconciles" },
  { activity: "Farmer Payment", flow: ["FA", "HQ"], description: "Finance initiates, HQ disburses" },
  { activity: "Stock Write-off", flow: ["WM", "AO", "HQ"], description: "Multi-level approval for damaged/expired goods" },
];

const WorkflowSection = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/40">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-himfed-info/10 text-himfed-info text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              <span>Approval Workflows</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Multi-Level <span className="text-himfed-info">Approval System</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every critical action passes through defined approval chains for complete accountability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {workflows.map((wf, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-card border border-border hover:border-himfed-info/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">{wf.activity}</h3>
                  <Clock className="w-5 h-5 text-muted-foreground group-hover:text-himfed-info transition-colors" />
                </div>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {wf.flow.map((step, si) => (
                    <div key={si} className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-mono font-semibold">{step}</div>
                      {si < wf.flow.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  ))}
                  <CheckCircle2 className="w-5 h-5 text-himfed-success ml-2" />
                </div>
                <p className="text-sm text-muted-foreground">{wf.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
