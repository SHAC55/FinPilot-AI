import { useEffect, useState } from "react";
import axios from "axios";

const Archive = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")); // stored after login
  const userId = user?._id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchArchives = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching archives for user:", userId);

        const { data } = await axios.get(
          `http://localhost:5000/api/transaction/archivetransaction/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Archives response:", data);
        setArchives(data);
      } catch (err) {
        console.error("Error fetching archives:", err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArchives();
  }, [userId]);

  if (loading) {
    return <div className="p-6">Loading archives...</div>;
  }

  if (!archives.length) {
    return <div className="p-6 text-gray-600">No archived transactions yet.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Archived Transactions</h2>
      {archives.map((archive) => (
        <div key={archive._id} className="mb-6 border rounded-lg p-4 shadow">
          <h3 className="font-semibold mb-2">
            {archive.month}/{archive.year}
          </h3>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Title</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Category</th>
                <th>Method</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {archive.transactions.map((t) => (
                <tr key={t._id}>
                  <td className="p-2">{t.title}</td>
                  <td>{t.amount}</td>
                  <td>{t.type}</td>
                  <td>{t.category}</td>
                  <td>{t.method}</td>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Archive;
