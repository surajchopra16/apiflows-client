/** Imported modules */
import type { Connector, Node } from "./types.ts";
import { WorkflowExecutor } from "../workflow/workflow-executor.ts";
import { nodeRegistry } from "../workflow/node-registry.ts";
import type { Workflow } from "../workflow/types.ts";

/**
 * Creates the workflow JSON representation
 * @param name The workflow name
 * @param nodes The nodes
 * @param connectors The connectors
 */

const createWorkflowJSON = (name: string, nodes: Node[], connectors: Connector[]): Workflow => {
    return {
        name: name,
        nodes: nodes.map((node) => ({
            id: node.id,
            type: node.type,
            position: [node.position.x, node.position.y],
            parameters: node.parameters
        })),
        connectors: connectors.map((connector) => ({
            id: connector.id,
            source: connector.source,
            sourcePort: connector.sourcePort,
            target: connector.target,
            targetPort: connector.targetPort
        }))
    };
};

/**
 * Runs the workflow
 * @param workflow The workflow
 * @param onNodeStatusChange The callback for node status changes
 */

const runner = async (
    workflow: Workflow,
    onNodeStatusChange: (data: {
        nodeId: string;
        status: "running" | "completed" | "failed";
    }) => void
) => {
    const workflowExecutor = new WorkflowExecutor(workflow, nodeRegistry);
    workflowExecutor.on("node-status", onNodeStatusChange);
    await workflowExecutor.run();
};

export { createWorkflowJSON, runner };
