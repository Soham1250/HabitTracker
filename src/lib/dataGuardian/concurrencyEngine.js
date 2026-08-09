// Concurrency Control, Lock Manager & Wait-For Graph Deadlock Engine

export class ConcurrencyEngine {
  constructor() {
    this.lockTable = [];
    this.waitForGraph = [];
  }

  detectDeadlockCycle(graphEdges) {
    // graphEdges: Array of { from: "T1", to: "T2" }
    const adj = {};
    graphEdges.forEach(({ from, to }) => {
      if (!adj[from]) adj[from] = [];
      adj[from].push(to);
    });

    const visited = {};
    const recStack = {};

    let hasCycle = false;
    let cycleNodes = [];

    const dfs = (node, path) => {
      visited[node] = true;
      recStack[node] = true;
      path.push(node);

      const neighbors = adj[node] || [];
      for (const neighbor of neighbors) {
        if (!visited[neighbor]) {
          if (dfs(neighbor, path)) return true;
        } else if (recStack[neighbor]) {
          hasCycle = true;
          cycleNodes = [...path, neighbor];
          return true;
        }
      }

      recStack[node] = false;
      path.pop();
      return false;
    };

    const nodes = Object.keys(adj);
    for (const node of nodes) {
      if (!visited[node]) {
        if (dfs(node, [])) break;
      }
    }

    return {
      hasDeadlock: hasCycle,
      cycleNodes,
      recommendation: hasCycle 
        ? "Deadlock detected! Abort younger transaction T2 and issue ROLLBACK to release held locks."
        : "No deadlock cycle detected. Execution is serializable."
    };
  }

  evaluateLocks(lockList) {
    // Shared (S) locks allow other S locks but conflict with Exclusive (X) locks
    // Exclusive (X) locks conflict with both S and X locks
    let conflicts = [];
    for (let i = 0; i < lockList.length; i++) {
      for (let j = i + 1; j < lockList.length; j++) {
        const l1 = lockList[i];
        const l2 = lockList[j];
        if (l1.resource === l2.resource && l1.tx !== l2.tx) {
          if (l1.type === "X" || l2.type === "X") {
            conflicts.push({
              resource: l1.resource,
              tx1: l1.tx,
              tx2: l2.tx,
              reason: `Conflict: ${l1.tx} (${l1.type}-lock) and ${l2.tx} (${l2.type}-lock) on ${l1.resource}`
            });
          }
        }
      }
    }
    return conflicts;
  }
}
