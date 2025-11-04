/** Imported modules */
import type { Workflow, WorkflowConnector, WorkflowNode } from "./types.ts";
import type { NodeRegistry } from "./node-registry.ts";
import { NodeExecutor } from "./node-executor.ts";
import { EventEmitter } from "../../../shared/utils/event-emitter.ts";

/**
 * The workflow executor class to run the workflow, manage node execution order and handle errors
 */

export class WorkflowExecutor extends EventEmitter {
    /** Nodes and connectors */
    private readonly nodes: WorkflowNode[];
    private readonly connectors: WorkflowConnector[];

    /** Node executor instance */
    private nodeExecutor: NodeExecutor;

    /** Map to store node outputs */
    private outputs = new Map<string, any>();

    /**
     * Constructor
     * @param workflow
     * @param nodeRegistry
     */

    constructor(workflow: Workflow, nodeRegistry: NodeRegistry) {
        super();

        this.nodes = workflow.nodes;
        this.connectors = workflow.connectors;
        this.nodeExecutor = new NodeExecutor(nodeRegistry);
    }

    /**
     * Runs the workflow
     */

    async run() {
        const adjacencyList = this.createAdjacencyList();
        const inDegree = this.createInDegree();
        const queue: string[] = [];

        // Initialize the queue with the start node
        const startNode = this.getStartNode();
        queue.push(startNode.id);

        while (queue.length > 0) {
            const nodeId = queue.shift()!;

            const node = this.nodes.find((node) => node.id === nodeId);
            if (!node) continue;

            // Collect all the inputs for the node and check if all the inputs are present
            const inputs = this.collectInputs(nodeId);
            const valid = this.nodeExecutor.checkInputs(node, inputs);
            if (!valid) continue;

            this.emit("node-status", { nodeId, status: "running" });

            // Execute the node
            const result = await this.nodeExecutor.execute(node, inputs);

            // Handle the error case
            if (result.error) {
                this.emit("node-status", { nodeId, status: "failed", error: result.error });
                continue;
            }

            // Handle the success case
            this.outputs.set(node.id, result.outputs);
            this.emit("node-status", { nodeId, status: "completed", outputs: result.outputs });

            // Decrease the in-degree of neighboring nodes
            for (const id of adjacencyList[nodeId]) {
                inDegree[id]--;

                // When all the dependencies are resolved, add to queue
                if (inDegree[id] === 0) queue.push(id);
            }
        }
    }

    /**
     * Creates the adjacency list for the workflow (Outgoing connectors)
     * @private
     */

    private createAdjacencyList(): Record<string, string[]> {
        const adjacencyList: Record<string, string[]> = {};

        // Initialize the adjacency list
        for (const node of this.nodes) adjacencyList[node.id] = [];

        // Add the outgoing connectors of each node
        for (const connector of this.connectors)
            adjacencyList[connector.source].push(connector.target);

        return adjacencyList;
    }

    /**
     * Creates the in-degree map for the workflow (Incoming connectors count)
     * @private
     */

    private createInDegree(): Record<string, number> {
        const inDegree: Record<string, number> = {};

        // Initialize the in-degree map
        for (const node of this.nodes) inDegree[node.id] = 0;

        // Count the incoming connectors for each node
        for (const connector of this.connectors) inDegree[connector.target]++;

        return inDegree;
    }

    /**
     * Gets the start node of the workflow
     * @private
     */

    private getStartNode() {
        const startNode = this.nodes.find((node) => node.type === "start");
        if (!startNode) throw new Error("No start node found in the workflow");

        return startNode;
    }

    /**
     * Collects all the inputs for the node from its incoming connectors
     * @param nodeId The node id
     * @private
     */

    private collectInputs(nodeId: string): Record<string, any> {
        // Find all the incoming connectors
        const connectors = this.connectors.filter((c) => c.target === nodeId);
        const inputs: Record<string, any> = {};

        for (const connector of connectors) {
            // Get the output of the source node
            const outputs = this.outputs.get(connector.source);
            if (outputs && outputs[connector.sourcePort] !== undefined)
                inputs[connector.targetPort] = outputs[connector.sourcePort];
        }

        return inputs;
    }
}
