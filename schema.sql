-- schema.sql

CREATE TABLE IF NOT EXISTS Users (
    ID TEXT PRIMARY KEY,
    KYC_Status TEXT NOT NULL,
    Linked_Bank_Account_ID TEXT
);

CREATE TABLE IF NOT EXISTS Pools (
    ID TEXT PRIMARY KEY,
    Total_Balance REAL NOT NULL DEFAULT 0.0,
    Governance_Rules TEXT NOT NULL, -- JSON string
    Goal_Amount REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS Ledger_Entries (
    Entry_ID TEXT PRIMARY KEY,
    User_ID TEXT NOT NULL,
    Pool_ID TEXT NOT NULL,
    Amount REAL NOT NULL,
    Type TEXT NOT NULL, -- Credit, Debit, Pending
    Trigger_Source TEXT NOT NULL, -- e.g., "Round-up", "Deposit", "Withdrawal"
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(ID),
    FOREIGN KEY (Pool_ID) REFERENCES Pools(ID)
);

CREATE TABLE IF NOT EXISTS Votes (
    Vote_ID TEXT PRIMARY KEY,
    Request_ID TEXT NOT NULL,
    User_ID TEXT NOT NULL,
    Status TEXT NOT NULL, -- Approve, Deny
    FOREIGN KEY (User_ID) REFERENCES Users(ID)
);

-- Insert dummy data for testing
INSERT OR IGNORE INTO Users (ID, KYC_Status, Linked_Bank_Account_ID) VALUES 
('u1', 'Verified', 'bank_123'),
('u2', 'Verified', 'bank_456'),
('u3', 'Pending', NULL);

INSERT OR IGNORE INTO Pools (ID, Total_Balance, Governance_Rules, Goal_Amount) VALUES 
('p1', 1500.0, '{"approval_threshold": 0.51}', 5000.0);

INSERT OR IGNORE INTO Ledger_Entries (Entry_ID, User_ID, Pool_ID, Amount, Type, Trigger_Source) VALUES 
('e1', 'u1', 'p1', 500.0, 'Credit', 'Deposit'),
('e2', 'u2', 'p1', 1000.0, 'Credit', 'Deposit');
