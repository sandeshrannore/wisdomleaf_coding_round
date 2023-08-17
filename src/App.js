import React, { useState, useEffect } from "react";
import "./App.css"; // Import your CSS styles

function formatNumber(number) {
  return new Intl.NumberFormat("en-US").format(number);
}

function App() {
  // State variables to manage data, sorting, filtering, and total revenue
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState(true); // Default sort order is ascending
  const [filterText, setFilterText] = useState(""); // Filter text for product name
  const [totalRevenue, setTotalRevenue] = useState(0); // Total revenue of displayed products

  useEffect(() => {
    // Fetch and process data when sortOrder or filterText changes
    const fetchData = async () => {
      try {
        // Fetch data from multiple JSON files
        const branchPromises = [
          "branch1.json",
          "branch2.json",
          "branch3.json",
        ].map((branchFileName) =>
          fetch(`${branchFileName}`).then((response) => response.json())
        );

        const branchDataArray = await Promise.all(branchPromises);

        // Merge and process products from all branches
        const mergedProducts = {};

        branchDataArray.forEach((branchData) => {
          branchData.products.forEach((product) => {
            if (!mergedProducts[product.id]) {
              mergedProducts[product.id] = { ...product };
            } else {
              mergedProducts[product.id].sold += product.sold;
            }
          });
        });

        const mergedProductList = Object.values(mergedProducts);

        // Sort merged products based on sortOrder
        let sortedMergedProductList = [...mergedProductList];
        if (sortOrder === true) {
          sortedMergedProductList.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          sortedMergedProductList.sort((a, b) => b.name.localeCompare(a.name));
        }

        // Apply filterText to products
        if (filterText) {
          sortedMergedProductList = sortedMergedProductList.filter((product) =>
            product.name.toLowerCase().includes(filterText.toLowerCase())
          );
        }

        // Calculate and update total revenue
        const totalRev = sortedMergedProductList.reduce(
          (acc, product) => acc + product.sold * product.unitPrice,
          0
        );
        setTotalRevenue(totalRev);

        // Update state with sorted and filtered products
        setData(sortedMergedProductList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Fetch and process data
  }, [sortOrder, filterText]);

  return (
    <div className="App">
      <header>
        <h1>Wowcherfy Revenue Aggregator</h1>
      </header>
      <div className="search-container">
        <label>
          Search Product:
          <input
            type="text"
            placeholder="Filter by product name"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              Product Name
              <button onClick={() => setSortOrder(!sortOrder)}>
                {sortOrder ? "⬆" : "⬇"} {/* Display arrow based on sort order */}
              </button>
            </th>
            <th>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td id="price">${formatNumber(product.sold * product.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="total-cell">Total Revenue</td>
            <td className="total-cell">${formatNumber(totalRevenue)}</td>
          </tr>
        </tfoot>
      </table>
      <footer>
        <p>Made with ❤️ by Your Sandesh</p>
      </footer>
    </div>
  );
}

export default App;
