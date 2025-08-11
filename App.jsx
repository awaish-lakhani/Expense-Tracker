import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const inputRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("transactions"));
    if (saved) setTransactions(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (currentTransaction) {
      setDescription(currentTransaction.description);
      setAmount(currentTransaction.amount);
      setDate(currentTransaction.date);
    } else {
      setDescription("");
      setAmount("");
      setDate("");
    }
    inputRef.current && inputRef.current.focus();
  }, [currentTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      date,
    };

    if (currentTransaction) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === currentTransaction.id ? newTransaction : t))
      );
      setIsEditing(false);
      setCurrentTransaction(null);
    } else {
      setTransactions((prev) => [...prev, newTransaction]);
    }
  };

  const handleDelete = (id) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  const handleEdit = (transaction) => {
    setCurrentTransaction(transaction);
    setIsEditing(true);
  };

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const filteredTransactions = transactions
    .filter((t) =>
      filter === "all"
        ? true
        : filter === "income"
        ? t.amount > 0
        : t.amount < 0
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );

  return (
    <div className="container">
      <h1>Personal Finance Tracker</h1>

      <div className="summary">
        <p>
          <strong>Total Income:</strong> ${income.toFixed(2)}
        </p>
        <p>
          <strong>Total Expenses:</strong> ${expense.toFixed(2)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="transaction-form">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          ref={inputRef}
          placeholder="Description"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (+ for income, - for expense)"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">
          {currentTransaction ? "Update" : "Add"}
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>SR</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((t, i) => (
            <tr key={t.id}>
              <td>{i + 1}</td>
              <td>{t.description}</td>
              <td className={t.amount > 0 ? "income" : "expense"}>
                {t.amount > 0 ? "+" : "-"}${Math.abs(t.amount).toFixed(2)}
              </td>
              <td>{t.date}</td>
              <td className="actions">
                <button onClick={() => handleEdit(t)}>Edit</button>
                <button onClick={() => handleDelete(t.id)}>Delete</button>
                </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
