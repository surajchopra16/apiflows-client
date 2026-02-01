/** Imported modules */
import type { NodeSpec } from "../utils/types.ts";
import { httpRequestNodeSpec } from "../components/HttpRequestNode.tsx";
import { startNodeSpec } from "../components/StartNode.tsx";

/**
 * Node registry singleton class
 */

class NodeRegistry {
    /** Singleton instance */
    private static instance: NodeRegistry;

    /** Registry map */
    private registry = new Map<string, NodeSpec>();

    /** Get the singleton instance */
    static getInstance() {
        if (!NodeRegistry.instance) NodeRegistry.instance = new NodeRegistry();
        return NodeRegistry.instance;
    }

    /** Register a new node specification */
    set(spec: NodeSpec) {
        if (this.registry.has(spec.type))
            throw new Error(`Node type "${spec.type}" is already registered`);
        this.registry.set(spec.type, spec);
    }

    /** Get a node specification by type */
    get(type: string) {
        return this.registry.get(type);
    }

    /** Check if a node type is registered */
    has(type: string) {
        return this.registry.has(type);
    }

    /** List all registered node specifications */
    list() {
        return Array.from(this.registry.values());
    }
}

// Create the node registry instance
const nodeRegistry = NodeRegistry.getInstance();

// Set the node specifications in the registry
nodeRegistry.set(startNodeSpec);
nodeRegistry.set(httpRequestNodeSpec);

export { NodeRegistry, nodeRegistry };
