/** Imported modules */
import type { NodeRegistry } from "./node-registry.ts";
import type { NodeContext, NodeSpec } from "../utils/types.ts";
import type { WorkflowNode } from "./types.ts";

/**
 * The node executor class to validate inputs/outputs, build context and execute nodes
 */

export class NodeExecutor {
    /** The node registry */
    private nodeRegistry: NodeRegistry;

    /**
     * Constructor
     * @param nodeRegistry The node registry
     */

    constructor(nodeRegistry: NodeRegistry) {
        this.nodeRegistry = nodeRegistry;
    }

    /**
     * Executes the node
     * @param node The workflow node
     * @param inputs The inputs
     */

    async execute(node: WorkflowNode, inputs: Record<string, any>) {
        try {
            const nodeSpec = this.nodeRegistry.get(node.type);
            if (!nodeSpec) throw new Error(`Node specification not found for type: ${node.type}`);

            // Build the node context
            const context = this.buildContext(node, inputs);

            // Execute the node specification handler
            const outputs = await nodeSpec.execute(context);

            this.checkOutputs(nodeSpec, outputs);

            return { outputs, error: null };
        } catch (err: any) {
            console.log(`[NODE EXECUTOR] Error executing node ${node.id}:`, err);
            return { outputs: null, error: err?.message ?? "Unknown error" };
        }
    }

    /**
     * Checks if all the inputs are present (inputs is a record of input port to value)
     * @param node The workflow node
     * @param inputs The inputs
     */

    checkInputs(node: WorkflowNode, inputs: Record<string, any>): boolean {
        const nodeSpec = this.nodeRegistry.get(node.type);
        if (!nodeSpec) return false;

        for (const input of nodeSpec.inputs) {
            if (!(input in inputs)) return false;
        }
        return true;
    }

    /**
     * Checks if all the outputs are valid (outputs is a record of output port to value)
     * @param nodeSpec The node specification
     * @param outputs The outputs
     * @private
     */

    private checkOutputs(nodeSpec: NodeSpec, outputs: Record<string, any>) {
        Object.entries(outputs).forEach(([key, value]) => {
            // Check if the output key is valid
            if (!nodeSpec.outputs.includes(key))
                throw new Error(
                    `Invalid output key "${key}" returned by node type: ${nodeSpec.type}`
                );

            // Check if the output value is either undefined or object
            if (value !== undefined && typeof value !== "object")
                throw new Error(
                    `Invalid output value for key "${key}" returned by node type: ${nodeSpec.type}`
                );
        });
    }

    /**
     * Builds the node context
     * @param node The workflow node
     * @param inputs The inputs
     * @private
     */

    private buildContext(node: WorkflowNode, inputs: Record<string, any>): NodeContext {
        return {
            getNodeParameter: (name: string) => node.parameters[name],
            getInput: (name: string) => inputs[name]
        };
    }
}
