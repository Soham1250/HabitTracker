// B-Tree and B+ Tree Storage & Index Simulation Engine

export class StorageEngine {
  constructor(totalRecords = 100000, recordsPerBlock = 100) {
    this.totalRecords = totalRecords;
    this.recordsPerBlock = recordsPerBlock;
    this.totalBlocks = Math.ceil(totalRecords / recordsPerBlock);
  }

  getHeapScanCost() {
    return {
      type: "Heap File Scan (No Index)",
      blockAccesses: this.totalBlocks,
      explanation: `Full table scan reads all ${this.totalBlocks.toLocaleString()} disk blocks sequentially.`
    };
  }

  getBPlusTreeIndexCost(rangeSize = 300) {
    // Fanout = 100 entries per index block
    const treeHeight = 3; // Root -> Level 1 -> Leaf
    const leafBlocksScanned = Math.ceil(rangeSize / this.recordsPerBlock);
    const totalAccesses = treeHeight + leafBlocksScanned;

    return {
      type: "B+ Tree Index Scan",
      treeHeight,
      leafBlocksScanned,
      blockAccesses: totalAccesses,
      explanation: `B+ Tree reads ${treeHeight} index node levels + ${leafBlocksScanned} sequential leaf blocks linked pointers = ${totalAccesses} total block reads.`
    };
  }

  traverseNodePath(targetKey, treeData) {
    const path = [];
    path.push({ level: "Root Node", keyChecked: treeData.root.keys[0], action: targetKey >= treeData.root.keys[0] ? "Go Right" : "Go Left" });
    if (targetKey >= 500) {
      path.push({ level: "Internal Node [750]", keyChecked: 750, action: targetKey <= 750 ? "Select Leaf [500-749]" : "Select Leaf [750-1000]" });
      path.push({ level: "Leaf Node Block", range: "500-749", action: "Access Data Pointer" });
    }
    return path;
  }
}
