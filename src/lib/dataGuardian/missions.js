// Data Guardian Missions - SEBI Grade A IT DBMS Syllabus Campaign Data

export const CHARACTERS = {
  anika: {
    name: "Anika Rao",
    role: "Senior Database Architect",
    avatar: "📐",
    color: "from-amber-500 to-orange-600",
    badge: "ER & Normalization Specialist"
  },
  kabir: {
    name: "Kabir Mehta",
    role: "SQL Investigator",
    avatar: "🔍",
    color: "from-blue-500 to-indigo-600",
    badge: "Query & Relational Analyst"
  },
  meera: {
    name: "Meera Shah",
    role: "Transaction Systems Lead",
    avatar: "⚡",
    color: "from-purple-500 to-pink-600",
    badge: "ACID & Concurrency Specialist"
  },
  dev: {
    name: "Dev Iyer",
    role: "Performance Engineer",
    avatar: "🚀",
    color: "from-emerald-500 to-teal-600",
    badge: "Storage & Index Optimization"
  },
  auditor: {
    name: "The SEBI Auditor",
    role: "Assessment Systems Inspector",
    avatar: "⚖️",
    color: "from-rose-500 to-red-600",
    badge: "SEBI IT Exam Evaluator"
  }
};

export const CHAPTERS = [
  {
    id: 1,
    title: "Chapter 1: The Broken Exchange",
    subtitle: "Database Concepts, Entities & Attributes",
    lead: "anika",
    topics: ["Database Concepts", "Entities", "Attributes", "Domains", "Derived Attributes"],
    brief: "The surveillance room is flooded with raw transaction logs and trade slips. Before we can query the market, we must distinguish entities, attributes, and domains.",
    icon: "🏗️",
    badge: "Schema Foundations"
  },
  {
    id: 2,
    title: "Chapter 2: Model the Market",
    subtitle: "ER Modeling, Cardinality & Constraints",
    lead: "anika",
    topics: ["ER Diagrams", "Cardinality (1:1, 1:N, M:N)", "Participation Constraints", "Foreign Keys"],
    brief: "Investor orders are disappearing from market reports because of a flawed 1:1 relationship constraint! Redesign the ER diagram and set foreign keys.",
    icon: "🔗",
    badge: "ER Architect"
  },
  {
    id: 3,
    title: "Chapter 3: The Account Hierarchy",
    subtitle: "Generalization & Specialization",
    lead: "anika",
    topics: ["Generalization", "Specialization", "Superclass / Subclass", "Inheritance", "Disjoint vs Overlapping"],
    brief: "Savings and Current accounts share basic balance fields but have distinct rules like interest rates and overdraft limits. Model the hierarchy cleanly.",
    icon: "🏛️",
    badge: "Hierarchy Expert"
  },
  {
    id: 4,
    title: "Chapter 4: Keys and Integrity",
    subtitle: "Primary Keys & Referential Integrity",
    lead: "kabir",
    topics: ["Primary Keys", "Candidate Keys", "Referential Integrity", "Entity Integrity", "CHECK Constraints"],
    brief: "Phantom trades referencing non-existent brokers are slipping into settlements! Enforce primary key, foreign key, and domain check constraints.",
    icon: "🗝️",
    badge: "Integrity Guardian"
  },
  {
    id: 5,
    title: "Chapter 5: Normalize the Evidence",
    subtitle: "Functional Dependencies & Normal Forms",
    lead: "anika",
    topics: ["Functional Dependencies", "1NF", "2NF", "3NF", "Update/Insert/Delete Anomalies"],
    brief: "Trade records suffer from massive redundancy! Updating an investor's phone number corrupts historical trades. Normalize relations to 3NF.",
    icon: "🧹",
    badge: "Normalization Master"
  },
  {
    id: 6,
    title: "Chapter 6: Query the Suspicious Trades",
    subtitle: "Relational Algebra & Advanced SQL",
    lead: "kabir",
    topics: ["Relational Algebra", "SQL SELECT", "JOINs", "GROUP BY & HAVING", "Subqueries (IN/EXISTS)"],
    brief: "Insider trading alerts require deep data extraction! Use Relational Algebra and complex SQL queries with JOINs, aggregations, and subqueries.",
    icon: "💻",
    badge: "SQL Investigator"
  },
  {
    id: 7,
    title: "Chapter 7: Speed Up the Investigation",
    subtitle: "File Organization & B/B+ Tree Indexing",
    lead: "dev",
    topics: ["File Organization (Heap, Sequential, Hashed)", "B-Tree Indexing", "B+ Tree Leaf Search", "Block Access Cost"],
    brief: "Market surveillance queries are timing out on billions of rows. Build and traverse B+ Tree indexes to minimize costly disk block accesses.",
    icon: "⚡",
    badge: "Index Specialist"
  },
  {
    id: 8,
    title: "Chapter 8: Protect the Settlement System",
    subtitle: "Transactions, ACID & Concurrency Control",
    lead: "meera",
    topics: ["ACID Properties", "Concurrency Anomalies", "Shared & Exclusive Locks", "Wait-For Graph & Deadlocks"],
    brief: "Concurrent settlement transactions are experiencing lost updates and deadlocks! Assign locks, verify serializability, and resolve deadlock cycles.",
    icon: "🛡️",
    badge: "Concurrency Guardian"
  }
];

export const MISSIONS = [
  // Mission 1: The Broken Exchange (Chapter 1)
  {
    id: "m1",
    chapterId: 1,
    title: "The Broken Exchange",
    type: "classification",
    topics: ["Entities vs Attributes", "Derived Data", "Domains"],
    difficulty: "Beginner",
    lead: "anika",
    story: "Welcome to Bharat Securities Exchange Market Tech division. Unstructured trade slips are piling up. Your first assignment is to organize these cards into Entities (real-world objects/events) and Attributes (their descriptive properties).",
    initialCards: [
      { id: "c1", label: "Investor", category: "entity", description: "Market participant buying/selling securities" },
      { id: "c2", label: "investor_id", category: "attribute", description: "Unique identifier for investor" },
      { id: "c3", label: "phone_number", category: "attribute", description: "Contact number domain: 10 digits" },
      { id: "c4", label: "Trade", category: "entity", description: "Event representing executed transaction" },
      { id: "c5", label: "trade_value", category: "derived", description: "Calculated attribute: quantity * price" },
      { id: "c6", label: "Broker", category: "entity", description: "Registered intermediary" },
      { id: "c7", label: "broker_code", category: "attribute", description: "Unique SEBI registration code" },
      { id: "c8", label: "Security", category: "entity", description: "Listed equity stock or bond" }
    ],
    targetBuckets: ["Entities", "Attributes", "Derived Attributes"],
    hints: [
      "Ask yourself: Is this a noun/object in the market domain (Entity), or a specific property describing an object (Attribute)?",
      "Notice trade_value: Can it be computed by multiplying quantity and price? If so, it's a Derived Attribute!",
      "Investor, Broker, Security, and Trade represent objects or transaction events (Entities).",
      "investor_id, phone_number, and broker_code describe entities (Attributes).",
      "Place Investor, Trade, Broker, Security under Entities; investor_id, phone_number, broker_code under Attributes; trade_value under Derived Attributes."
    ],
    examFollowUp: {
      question: "Which of the following attributes should be stored as a derived attribute in an exchange database?",
      options: [
        "A) investor_name",
        "B) trade_total_amount (quantity * unit_price)",
        "C) pan_card_number",
        "D) demat_account_no"
      ],
      correctAnswer: 1,
      explanation: "Derived attributes can be computed from existing database attributes (e.g. quantity * unit_price), avoiding redundant primary storage."
    }
  },

  // Mission 2: The Missing Orders (Chapter 2)
  {
    id: "m2",
    chapterId: 2,
    title: "The Missing Orders",
    type: "er_modeling",
    topics: ["ER Diagram", "Cardinality", "Participation", "Foreign Key Placement"],
    difficulty: "Beginner",
    lead: "anika",
    story: "Market surveillance officers reported that investor Ravi Shah (I102) placed two separate orders today, but only one order shows in the report! The current schema erroneously uses a 1:1 relationship between Investor and Order.",
    startingSchema: {
      entities: [
        { id: "Investor", name: "Investor", attributes: ["investor_id (PK)", "name", "phone"] },
        { id: "Order", name: "Order", attributes: ["order_id (PK)", "order_date", "quantity", "price"] },
        { id: "Security", name: "Security", attributes: ["security_id (PK)", "symbol", "exchange"] }
      ],
      relationships: [
        { from: "Investor", to: "Order", cardinality: "1:1", participation: "total", foreignKeyLocation: "Investor" }
      ]
    },
    sampleData: {
      Investor: [
        { investor_id: "I101", name: "Asha Rao", phone: "9000000001" },
        { investor_id: "I102", name: "Ravi Shah", phone: "9000000002" }
      ],
      Orders: [
        { order_id: "O501", investor_id: "I102", security_id: "S101", quantity: 100, price: 250 },
        { order_id: "O502", investor_id: "I102", security_id: "S102", quantity: 50, price: 810 },
        { order_id: "O503", investor_id: "I101", security_id: "S101", quantity: 75, price: 255 }
      ]
    },
    requiredSolution: {
      cardinality: "1:N",
      participation: "partial",
      foreignKeyTable: "Order",
      foreignKeyCol: "investor_id"
    },
    hints: [
      "Check how many orders Investor I102 placed in the sample data table. Is it only 1 or multiple?",
      "Investor I102 has 2 orders (O501 and O502). Therefore, one investor can place MANY orders (1:N relationship).",
      "Where does the foreign key belong in a 1:N relationship?",
      "The foreign key MUST reside on the MANY side relation (Order), pointing to the primary key of Investor.",
      "Set Cardinality to 1:N from Investor to Order and place investor_id as foreign key in Order."
    ],
    examFollowUp: {
      question: "If Entity A has a 1:N relationship with Entity B, where should the Foreign Key referencing A be placed?",
      options: [
        "A) In Entity A",
        "B) In Entity B (the N side)",
        "C) In a separate associative table only",
        "D) In both Entity A and Entity B"
      ],
      correctAnswer: 1,
      explanation: "For a 1:N binary relationship, the foreign key is placed in the relation representing the N side (Entity B) to uniquely link each tuple to one parent in Entity A."
    }
  },

  // Mission 3: The Account Hierarchy (Chapter 3)
  {
    id: "m3",
    chapterId: 3,
    title: "The Account Hierarchy",
    type: "hierarchy",
    topics: ["Superclass / Subclass", "Inheritance", "Disjoint vs Overlapping", "Table Mapping"],
    difficulty: "Intermediate",
    lead: "anika",
    story: "Bharat Exchange supports both Savings Accounts and Current Accounts. Both share core attributes (account_id, balance, opened_date), but Savings has interest_rate while Current has overdraft_limit. Build a clean Specialization hierarchy.",
    schemaOptions: {
      superClass: "Account",
      commonAttributes: ["account_id", "customer_id", "balance", "opened_date"],
      subClasses: [
        { name: "SavingsAccount", uniqueAttr: "interest_rate" },
        { name: "CurrentAccount", uniqueAttr: "overdraft_limit" }
      ]
    },
    targetConfig: {
      disjointness: "Disjoint", // An account is either Savings OR Current, not both
      completeness: "Total",    // Every account MUST be either Savings or Current
      mappingStrategy: "SuperclassWithSubclasses" // Superclass table + Subclass tables linked by PK
    },
    hints: [
      "Determine if an account can simultaneously be both a Savings Account and a Current Account (Disjoint vs Overlapping).",
      "In standard banking rules, an account is either Savings OR Current (Disjoint).",
      "Determine if every account must belong to one of these types (Total vs Partial completeness).",
      "Since all accounts must be categorized, completeness is Total.",
      "Select 'Disjoint', 'Total', and 'Superclass + Subclass Tables' mapping."
    ],
    examFollowUp: {
      question: "In ER modeling, if an entity instance can belong to more than one subclass in a specialization, the constraint is classified as:",
      options: [
        "A) Disjoint",
        "B) Overlapping",
        "C) Partial",
        "D) Total"
      ],
      correctAnswer: 1,
      explanation: "An Overlapping specialization constraint permits an entity instance in the superclass to simultaneously be a member of multiple subclasses."
    }
  },

  // Mission 4: Keys and Integrity (Chapter 4)
  {
    id: "m4",
    chapterId: 4,
    title: "Keys and Integrity",
    type: "keys_integrity",
    topics: ["Candidate Keys", "Primary Key Selection", "Referential Integrity", "CHECK Constraints"],
    difficulty: "Intermediate",
    lead: "kabir",
    story: "Audit alert! Settled trades contain negative quantities and orders referencing deleted brokers! Configure primary keys, foreign keys with ON DELETE rules, and domain CHECK constraints to safeguard table integrity.",
    tables: [
      {
        name: "Broker",
        columns: [
          { name: "broker_code", type: "VARCHAR(10)", isCandidate: true },
          { name: "pan_no", type: "VARCHAR(10)", isCandidate: true },
          { name: "name", type: "VARCHAR(50)", isCandidate: false }
        ]
      },
      {
        name: "Trade",
        columns: [
          { name: "trade_id", type: "INT", isCandidate: true },
          { name: "broker_code", type: "VARCHAR(10)", isForeign: true, refTable: "Broker" },
          { name: "quantity", type: "INT", checkRule: "quantity > 0" },
          { name: "price", type: "DECIMAL(10,2)", checkRule: "price > 0" }
        ]
      }
    ],
    requiredRules: {
      primaryKeyBroker: "broker_code",
      referentialIntegrity: "RESTRICT",
      tradeQuantityCheck: "quantity > 0"
    },
    hints: [
      "Both broker_code and pan_no are unique (Candidate Keys). Choose broker_code as the Primary Key.",
      "Check the Trade table: trade_id is the Primary Key, while broker_code references Broker(broker_code).",
      "What should happen if someone tries to delete a Broker that has active trades? Use RESTRICT or NO ACTION to preserve referential integrity!",
      "Add a domain CHECK constraint on Trade so quantity > 0 and price > 0.",
      "Set broker_code as PK for Broker, set foreign key Trade.broker_code -> Broker(broker_code) with RESTRICT, and add CHECK (quantity > 0)."
    ],
    examFollowUp: {
      question: "Which integrity constraint guarantees that a foreign key value in a child table must match an existing primary key value in the referenced parent table or be NULL?",
      options: [
        "A) Entity Integrity",
        "B) Referential Integrity",
        "C) Domain Integrity",
        "D) User-Defined Constraint"
      ],
      correctAnswer: 1,
      explanation: "Referential Integrity enforces that foreign key values must reference a valid existing primary key value in the parent relation (or be null if permitted)."
    }
  },

  // Mission 5: Normalize the Evidence (Chapter 5)
  {
    id: "m5",
    chapterId: 5,
    title: "Normalize the Evidence",
    type: "normalization",
    topics: ["Functional Dependencies", "1NF", "2NF", "3NF", "Anomalies"],
    difficulty: "Advanced",
    lead: "anika",
    story: "An unnormalized single relation `TradeRecord` stores investor details, broker details, and multiple securities per row! Updating an investor's phone number requires changing hundreds of rows (Update Anomaly). Normalize `TradeRecord` into 3NF relations.",
    unnormalizedTable: {
      name: "TradeRecord",
      attributes: ["trade_id", "investor_id", "investor_name", "investor_phone", "broker_id", "broker_name", "security_id", "symbol", "quantity"]
    },
    functionalDependencies: [
      { lhs: ["trade_id"], rhs: ["investor_id", "broker_id", "trade_date"] },
      { lhs: ["investor_id"], rhs: ["investor_name", "investor_phone"] },
      { lhs: ["broker_id"], rhs: ["broker_name"] },
      { lhs: ["security_id"], rhs: ["symbol"] },
      { lhs: ["trade_id", "security_id"], rhs: ["quantity"] }
    ],
    target3NFSchema: [
      { name: "Investor", pk: "investor_id", attrs: ["investor_name", "investor_phone"] },
      { name: "Broker", pk: "broker_id", attrs: ["broker_name"] },
      { name: "Security", pk: "security_id", attrs: ["symbol"] },
      { name: "Trade", pk: "trade_id", attrs: ["investor_id (FK)", "broker_id (FK)"] },
      { name: "TradeItem", pk: "(trade_id, security_id)", attrs: ["quantity"] }
    ],
    hints: [
      "Identify Partial Dependencies: investor_id -> investor_name depends only on investor_id, not the composite key!",
      "Identify Transitive Dependencies: trade_id -> investor_id -> investor_name.",
      "For 2NF: Remove partial dependencies on composite keys.",
      "For 3NF: Remove transitive dependencies where a non-prime attribute determines another non-prime attribute.",
      "Separate into 5 relations: Investor, Broker, Security, Trade, and TradeItem."
    ],
    examFollowUp: {
      question: "A relation is in Third Normal Form (3NF) if it is in 2NF and has no:",
      options: [
        "A) Partial dependencies",
        "B) Transitive dependencies",
        "C) Multivalued dependencies",
        "D) Join dependencies"
      ],
      correctAnswer: 1,
      explanation: "3NF requires that no non-prime attribute is transitively dependent on any candidate key of the relation."
    }
  },

  // Mission 6: Query the Suspicious Trades (Chapter 6)
  {
    id: "m6",
    chapterId: 6,
    title: "Query the Suspicious Trades",
    type: "sql_editor",
    topics: ["SQL JOINs", "GROUP BY", "HAVING", "Aggregates", "Subqueries (IN/EXISTS)"],
    difficulty: "Advanced",
    lead: "kabir",
    story: "Market Surveillance suspicious activity alert! Write an SQL query to list all investor names, their total trade count, and total trade value for investors who have placed more than 2 trades.",
    databaseSchema: {
      Investor: ["investor_id (PK)", "name", "phone"],
      Trade: ["trade_id (PK)", "investor_id (FK)", "quantity", "price", "trade_date"]
    },
    sampleData: {
      Investor: [
        { investor_id: "I101", name: "Asha Rao", phone: "9876543210" },
        { investor_id: "I102", name: "Ravi Shah", phone: "9876543211" },
        { investor_id: "I103", name: "Vikram Mehta", phone: "9876543212" }
      ],
      Trade: [
        { trade_id: "T001", investor_id: "I101", quantity: 100, price: 200 },
        { trade_id: "T002", investor_id: "I101", quantity: 50, price: 300 },
        { trade_id: "T003", investor_id: "I101", quantity: 150, price: 210 },
        { trade_id: "T004", investor_id: "I102", quantity: 400, price: 100 },
        { trade_id: "T005", investor_id: "I103", quantity: 20, price: 500 }
      ]
    },
    expectedQuerySnippet: "SELECT i.name, COUNT(t.trade_id) AS trade_count, SUM(t.quantity * t.price) AS total_val FROM Investor i JOIN Trade t ON i.investor_id = t.investor_id GROUP BY i.name HAVING COUNT(t.trade_id) > 2",
    requiredOutput: [
      { name: "Asha Rao", trade_count: 3, total_val: 66500 }
    ],
    hints: [
      "Join the Investor table (i) and Trade table (t) on investor_id.",
      "Group the aggregated results by investor name using GROUP BY i.name.",
      "Use COUNT(t.trade_id) to calculate trade count and SUM(t.quantity * t.price) for total value.",
      "To filter grouped results where trade count > 2, use the HAVING clause, not WHERE!",
      "Write: SELECT i.name, COUNT(t.trade_id) AS trade_count, SUM(t.quantity * t.price) AS total_val FROM Investor i JOIN Trade t ON i.investor_id = t.investor_id GROUP BY i.name HAVING COUNT(t.trade_id) > 2;"
    ],
    examFollowUp: {
      question: "Which SQL clause must be used to filter groups created by a GROUP BY clause?",
      options: [
        "A) WHERE",
        "B) HAVING",
        "C) ORDER BY",
        "D) FILTER BY"
      ],
      correctAnswer: 1,
      explanation: "HAVING is evaluated after GROUP BY to filter groups based on aggregate criteria, whereas WHERE filters individual rows prior to grouping."
    }
  },

  // Mission 7: Speed Up the Investigation (Chapter 7)
  {
    id: "m7",
    chapterId: 7,
    title: "Speed Up the Investigation",
    type: "indexing",
    topics: ["B+ Tree Traversal", "Range Search", "Block Access Cost", "Heap vs Index"],
    difficulty: "Advanced",
    lead: "dev",
    story: "A surveillance query searching for trades between trade_id 500 and 800 scans all 1,000,000 blocks in a Heap File (1,000,000 I/O operations)! Traverse the B+ Tree index to find the leaf block in just 3 block reads.",
    treeData: {
      root: { keys: [500], children: ["node_left", "node_right"] },
      node_left: { keys: [250], children: ["leaf_1", "leaf_2"] },
      node_right: { keys: [750], children: ["leaf_3", "leaf_4"] },
      leaf_1: { range: "1-249", blocks: 25 },
      leaf_2: { range: "250-499", blocks: 25 },
      leaf_3: { range: "500-749", blocks: 25, target: true },
      leaf_4: { range: "750-1000", blocks: 25, target: true }
    },
    targetRange: [500, 800],
    hints: [
      "Start at Root node [500]. Since search start is 500, follow the right pointer (keys >= 500).",
      "At Internal Node [750], 500 is <= 750, so check leaf_3 (range 500-749).",
      "B+ Tree leaf nodes are linked in a sequential doubly-linked list, allowing fast range scans from leaf_3 to leaf_4!",
      "Compare block accesses: Heap Scan = 1,000,000 blocks vs B+ Tree Index = 3 tree levels + 2 leaf blocks (5 total reads).",
      "Follow path: Root -> Internal Node [750] -> Leaf Node [500-749] -> Leaf Node [750-1000]."
    ],
    examFollowUp: {
      question: "Why are B+ Trees preferred over B-Trees for database index implementation?",
      options: [
        "A) B+ Trees store data records only in leaf nodes, leaving internal nodes clean for index keys and enabling efficient range queries via linked leaves",
        "B) B+ Trees require less memory for leaf nodes",
        "C) B-Trees do not support multi-level searching",
        "D) B+ Trees do not require rebalancing"
      ],
      correctAnswer: 0,
      explanation: "In a B+ Tree, all data records/pointers reside exclusively in the leaf nodes, which are linked sequentially, allowing optimal range scans and high fan-out in upper index nodes."
    }
  },

  // Mission 8: Protect the Settlement System (Chapter 8)
  {
    id: "m8",
    chapterId: 8,
    title: "Protect the Settlement System",
    type: "concurrency",
    topics: ["ACID Properties", "Concurrency Anomalies", "Shared/Exclusive Locks", "Deadlock Wait-For Graph"],
    difficulty: "Expert",
    lead: "meera",
    story: "System freeze! Settlement transaction T1 locked Account A and is requesting Account B, while T2 locked Account B and is requesting Account A. Identify the deadlock cycle in the Wait-For Graph and resolve it by selecting a deadlock resolution strategy.",
    initialSchedule: {
      transactions: ["T1", "T2"],
      resources: ["Account_A", "Account_B"],
      locksHeld: [
        { tx: "T1", resource: "Account_A", type: "X" },
        { tx: "T2", resource: "Account_B", type: "X" }
      ],
      requestsWaiting: [
        { tx: "T1", waitingFor: "Account_B", heldBy: "T2" },
        { tx: "T2", waitingFor: "Account_A", heldBy: "T1" }
      ]
    },
    targetActions: {
      detectCycle: true, // T1 -> T2 -> T1
      cycleNodes: ["T1", "T2"],
      resolutionStrategy: "VictimSelectionAbort" // Abort younger transaction T2 and rollback
    },
    hints: [
      "Draw the Wait-For Graph edges: T1 holds A and waits for B (held by T2), so edge T1 -> T2. T2 holds B and waits for A (held by T1), so edge T2 -> T1.",
      "Notice the closed cycle: T1 -> T2 -> T1. A cycle in a Wait-For Graph indicates a DEADLOCK!",
      "How do we break a deadlock cycle?",
      "We select a victim transaction (e.g. T2 with lowest cost) to abort and roll back, releasing its held lock on Account_B.",
      "Select cycle T1 <-> T2, declare Deadlock, and choose 'Abort & Rollback Victim (T2)'."
    ],
    examFollowUp: {
      question: "In transaction concurrency control, a directed cycle in a Wait-For Graph (WFG) signifies the occurrence of:",
      options: [
        "A) Dirty Read",
        "B) Lost Update",
        "C) Deadlock",
        "D) Phantom Read"
      ],
      correctAnswer: 2,
      explanation: "A Wait-For Graph (WFG) represents transactions as nodes and lock dependencies as directed edges. A directed cycle in the WFG indicates a circular wait state (Deadlock)."
    }
  }
];
