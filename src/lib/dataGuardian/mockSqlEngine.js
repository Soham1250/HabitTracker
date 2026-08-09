// Mock client-side SQL execution & validation engine for SEBI Data Guardian

export class MockSqlEngine {
  constructor(initialData = {}) {
    this.tables = JSON.parse(JSON.stringify(initialData));
  }

  execute(queryStr) {
    if (!queryStr || !queryStr.trim()) {
      return { success: false, error: "Empty query string provided." };
    }

    const cleanQuery = queryStr.trim().replace(/;/g, "");
    const upperQuery = cleanQuery.toUpperCase();

    try {
      if (upperQuery.startsWith("SELECT")) {
        return this.handleSelect(cleanQuery);
      } else if (upperQuery.startsWith("INSERT")) {
        return this.handleInsert(cleanQuery);
      } else if (upperQuery.startsWith("UPDATE")) {
        return this.handleUpdate(cleanQuery);
      } else if (upperQuery.startsWith("DELETE") || upperQuery.startsWith("TRUNCATE")) {
        return this.handleDeleteOrTruncate(cleanQuery);
      } else if (upperQuery.startsWith("CREATE TABLE") || upperQuery.startsWith("ALTER TABLE")) {
        return { success: true, message: "Schema definition updated successfully.", rows: [] };
      } else {
        return { success: false, error: `Unsupported command in query: ${cleanQuery.split(" ")[0]}` };
      }
    } catch (err) {
      return { success: false, error: `SQL Syntax / Runtime Error: ${err.message}` };
    }
  }

  handleSelect(query) {
    // Example: SELECT i.name, COUNT(t.trade_id) AS trade_count, SUM(t.quantity * t.price) AS total_val FROM Investor i JOIN Trade t ON i.investor_id = t.investor_id GROUP BY i.name HAVING COUNT(t.trade_id) > 2
    const isJoin = query.toUpperCase().includes("JOIN");
    const isGroupBy = query.toUpperCase().includes("GROUP BY");
    const isHaving = query.toUpperCase().includes("HAVING");

    if (isJoin && isGroupBy && isHaving) {
      // Return expected sample result for Mission 6
      const results = [
        { name: "Asha Rao", trade_count: 3, total_val: 66500 }
      ];
      return {
        success: true,
        columns: ["name", "trade_count", "total_val"],
        rows: results,
        rowCount: results.length,
        executionTimeMs: 1.4
      };
    }

    if (isJoin) {
      const results = [
        { investor_id: "I101", name: "Asha Rao", trade_id: "T001", quantity: 100, price: 200 },
        { investor_id: "I101", name: "Asha Rao", trade_id: "T002", quantity: 50, price: 300 },
        { investor_id: "I101", name: "Asha Rao", trade_id: "T003", quantity: 150, price: 210 },
        { investor_id: "I102", name: "Ravi Shah", trade_id: "T004", quantity: 400, price: 100 },
        { investor_id: "I103", name: "Vikram Mehta", trade_id: "T005", quantity: 20, price: 500 }
      ];
      return {
        success: true,
        columns: ["investor_id", "name", "trade_id", "quantity", "price"],
        rows: results,
        rowCount: results.length,
        executionTimeMs: 0.8
      };
    }

    // Default SELECT fallback on Investor table
    const tableKeys = Object.keys(this.tables);
    if (tableKeys.length > 0) {
      const firstTable = tableKeys[0];
      const rows = this.tables[firstTable] || [];
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
      return {
        success: true,
        columns,
        rows,
        rowCount: rows.length,
        executionTimeMs: 0.5
      };
    }

    return {
      success: true,
      columns: ["id", "status"],
      rows: [{ id: 1, status: "OK" }],
      rowCount: 1,
      executionTimeMs: 0.4
    };
  }

  handleInsert(query) {
    return {
      success: true,
      message: "1 row inserted successfully.",
      affectedRows: 1
    };
  }

  handleUpdate(query) {
    return {
      success: true,
      message: "Records updated successfully.",
      affectedRows: 1
    };
  }

  handleDeleteOrTruncate(query) {
    return {
      success: true,
      message: "Delete operation executed cleanly.",
      affectedRows: 1
    };
  }
}
