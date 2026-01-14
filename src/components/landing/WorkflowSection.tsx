import { ArrowRight, CheckCircle2, Clock, Users } from "lucide-react";

const workflows = [
  {
    activity: "Purchase Order",
    flow: ["PM", "HQ"],
    description: "Procurement Manager creates, HQ Admin approves",
  },
  {
    activity: "Godown Receipt",
    flow: ["WS", "WM", "AO"],
    description: "Staff scans, Manager verifies, Area Office confirms",
  },
  {
    activity: "Stock Transfer",
    flow: ["AO", "HQ"],
    description: "Area Office requests, Head Office authorizes",
  },
  {
    activity: "Petrol Credit",
    flow: ["FM", "FA"],
    description: "Fuel Manager issues, Finance Officer reconciles",
  },
  {
    activity: "Farmer Payment",
    flow: ["FA", "HQ"],
    description: "Finance initiates, HQ disburses",
  },
  {
    activity: "Stock Write-off",
    flow: ["WM", "AO", "HQ"],
    description: "Multi-level approval for damaged/expired goods",
  },
];

const WorkflowSection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16 stagger-children">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-himfed-info/10 text-himfed-info text-sm mb-4">
              <Users className="w-4 h-4" />
              <span>Approval Workflows</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Multi-Level
              <span className="text-himfed-info"> Approval System</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every critical action passes through defined approval chains, 
              ensuring accountability and preventing unauthorized changes.
            </p>
          </div>

          {/* Workflows */}
          <div className="grid md:grid-cols-2 gap-6">
            {workflows.map((workflow, index) => (
              <div 
                key={index}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-himfed-info/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">
                    {workflow.activity}
                  </h3>
                  <Clock className="w-5 h-5 text-muted-foreground group-hover:text-himfed-info transition-colors" />
                </div>

                {/* Flow visualization */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {workflow.flow.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-mono font-semibold">
                        {step}
                      </div>
                      {stepIndex < workflow.flow.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                  <CheckCircle2 className="w-5 h-5 text-himfed-success ml-2" />
                </div>

                <p className="text-sm text-muted-foreground">
                  {workflow.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
