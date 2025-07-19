import type { Purchase, Rental } from "../types/types";

interface HistoryTableProps {
  data: Purchase[] | Rental[];
  type: "purchases" | "rentals";
  columns: string[];
}

const HistoryTable = ({ data, type, columns }: HistoryTableProps) => {
  if (data.length === 0) {
    return <p className="text-gray-500 text-center py-4">No {type} found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {type === "purchases"
            ? (data as Purchase[]).map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-200">
                    {typeof purchase.game.id === "object"
                      ? purchase.game.name
                      : "Unknown Game"}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    ${purchase.price}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {new Date(purchase.purchase_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            : (data as Rental[]).map((rental) => (
                <tr key={rental.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-200">
                    {typeof rental.game.id === "object"
                      ? rental.game.name
                      : "Unknown Game"}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {new Date(rental.rent_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {new Date(rental.expire_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        rental.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {rental.status}
                    </span>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
