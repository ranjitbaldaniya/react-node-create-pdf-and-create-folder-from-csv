import React from "react";
import { useEffect, useState } from "react";
const Interview = () => {
  const url = "https://anapioficeandfire.com/api/books";

  const [books, setBooks] = useState([]);

  const [booksData, setBooksData] = useState([]);
  console.log("booksData", booksData);

  // const sortedData = booksData.sort((item) => item.mediaType == );

  // console.log("sortedData", sortedData);

  const fetchBooks = async () => {
    try {
      const res = await fetch(url);
      // .then((data) => data.json())
      // .then((books) => setBooksData(books));

      const data = await res.json();
      console.log("data", data);

      // Sort the data based on mediaType
      const sortedData = data.sort((a, b) =>
        a.mediaType.localeCompare(b.mediaType)
      );
      console.log("sortedData", sortedData);

      const filteredData = sortedData.filter(
        (books) => books.mediaType === "Hardcover"
      );
      console.log("1412==>", filteredData);

      setBooksData(sortedData);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  //handleGetBooksData
  const handleGetBooksData = (books) => {
    console.log("books ===>", books);
    setBooks(books);
  };

  return (
    <div>
      Interview
      <table>
        <thead>
          <tr>
            <th> Name</th>
            <th>Country</th>
            <th>MediaType</th>
          </tr>
        </thead>
        <tbody>
          {booksData.map((books, i) => (
            <>
              <tr
                key={books.name}
                onClick={() => handleGetBooksData(books)}
                style={{ cursor: "pointer" }}
              >
                <td>{books.name}</td>
                <td>{books.country}</td>
                <td>{books.mediaType}</td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
      <>
        <h2>Clicked Row Data</h2>
        <p>{books.name}</p>
        <p>{books.country}</p>
        <p>{books.mediaType}</p>
      </>
    </div>
  );
};

export default Interview;
