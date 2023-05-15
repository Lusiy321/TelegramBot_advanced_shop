const crypto = require("crypto");
const axios = require("axios");
const URL = "https://api-testnet.bybit.com";

const allCoinUrl = "/spot/v3/public/symbols";

const apiKey = "5wtHSGulEfw8leEYeA";
const secret = "xxxx";
const timestamp = Date.now().toString();

const getall = async function getAllcoinList() {
  try {
    const resp = await axios.get(`${URL}${allCoinUrl}`);
    return resp;
  } catch (e) {
    throw new Error(e);
  }
};



module.exports = getall;
