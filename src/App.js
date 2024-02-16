import React, { useState, useEffect } from "react";
import { format } from "date-fns";

function App() {

  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  //const [country, setCountry] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const geolocate = async () => {
      try {
        const res = await fetch('https://api.ipify.org/?format=json');
        const ipObj = await res.json();
        const ip = ipObj.ip;
        console.log(ip);

        const st = `https://ipapi.co/${ip}/json`;
        console.log(st);

        const res2 = await fetch(st);

        if (!res2.ok) {
          throw new Error(`HTTP error! Status: ${res2.status}`);
        }

        const countryObj = await res2.json();
        console.log(countryObj);
        //setCountry(countryObj.country_name);
        setQuery(countryObj.country_name);
      } catch (error) {
        console.error('Error fetching or parsing second API:', error);
      }
    };

    geolocate();
  }, []);

  
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(`https://hn.algolia.com/api/v1/search_by_date?query=${query}&tags=story`);
        const data = await res.json();
        setItems(data.hits);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }

      setIsLoading(false);
    };

    fetchArticles();
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (text) {
      setQuery(text);
      setText("");
    }
  };

  return (
    <section className="section">
      <h1>ニュース</h1>

      <form autoComplete="off" onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          id="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search for something"
        />
        <button>Search</button>
      </form>

      {isLoading ? (
        <div className="spinner"></div>
      ) : (
        <>
          <p className="category">Category: <span>{query}</span></p>

          <article className="cards">
            {items.map(({ author, created_at, title, url, objectID }) => (
              <div key={objectID}>
                <h2>{title}</h2>
                <ul>
                  <li>By {author}</li>
                  <li><a href={url} target="_blank" rel="noreferrer">Read Full Article</a></li>
                </ul>
                <p>{format(new Date(created_at), "dd MMMM yyyy")}</p>
              </div>
            ))}
          </article>
        </>
      )}
    </section>
  );
}

export default App;
