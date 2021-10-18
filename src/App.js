import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "antd";
import "./App.css";

const Ticker = () => {
  const [search, setSearch] = useState("shiba-inu");
  const [coinData, setCoinData] = useState([]);

  const searchHandler = async (e) => {
    if (e.target.value.includes(" ")) {
      let value = e.target.value.split(" ");
      setSearch(value.join("-"));
      return;
    }
    await setSearch(e.target.value);
  };

  //INITIAL API CALL ON CLICK
  const api = async (search) => {
    await axios
      .get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${search}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      )
      .then((res) => {
        setCoinData(res.data);
        console.log(res.data[0].id);
      })
      .catch((e) => console.log("failed request"));
  };

  useEffect(() => {
    api(search);
  }, []);

  useEffect(() => {
    if (coinData.length === 0) {
      return;
    }

    const apiCall = setInterval(() => {
      const searchApi = async () => {
        const { data } = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinData[0].id}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
        );
        console.log(data);
        await setCoinData(data);
      };
      try {
        searchApi();
      } catch (e) {
        console.log(e);
      }
    }, 5000);
    return () => {
      console.log(coinData);
      console.log("cleared interval");
      clearInterval(apiCall);
    };
  }, [coinData]);

  const mappedCoin = coinData.map((coin) => {
    return (
      //////EDIT THESE TO BE FORMATTED WITH CSS LATER, NOT FUCKING H1s
      <div className="coin-container" key={coin.id}>
        <img className="coin-img" src={coin.image} alt="" />
        <h1>{coin.name}</h1>
        <h3 className="price-container">{coin.symbol.toUpperCase()}</h3>
        <h2
          style={
            coin.price_change_percentage_24h > 0
              ? { color: "red" }
              : { color: "green" }
          }
        >{`$${coin.current_price}`}</h2>
        <h2>{`$${coin.market_cap.toLocaleString()}`}</h2>
        <div className="search-container"></div>
      </div>
    );
  });

  return (
    <Card style={{ height: 800 }}>
      <div className="container">
        <div>{mappedCoin}</div>
        <div className="search-container">
          <input
            className="ticker-input"
            type="text"
            value={search}
            onChange={searchHandler}
          />
          <button
            className="search-button"
            onClick={(e) => {
              e.preventDefault();
              // setSearch(search);
              api(search);
            }}
          >
            search
          </button>
        </div>
      </div>
    </Card>
  );
};

export default Ticker;
