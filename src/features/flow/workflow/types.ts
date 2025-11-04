/** Workflow node type */
export type WorkflowNode = {
    id: string;
    type: string;
    position: [number, number];
    parameters: any;
};

/** Workflow connector type */
export type WorkflowConnector = {
    id: string;
    source: string;
    sourcePort: string;
    target: string;
    targetPort: string;
};

/** Workflow type */
export type Workflow = {
    name: string;
    nodes: WorkflowNode[];
    connectors: WorkflowConnector[];
};
