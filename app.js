const cheerio = require("cheerio"),
  cheerioTableparser = require("cheerio-tableparser");

/**
 * Author: M Khoirul Risqi
 * Github: https://github.com/risqikhoirul/BscscanTokenTranfer-Scrapping
 * Licence: MIT
 * @param {node app <address>}
 * example: node app 0x714cb1145218871faebd55de36dbe7053cc9c74d
 * @returns:
 * Object: {
 *           success: boolean,
 *           message: [{...},
 *                     {...},
 *                      ...]}
 */

const functionBscAddress = (address) =>
  new Promise((resolve, reject) => {
    try {
      let message = [];
      fetch(`https://bscscan.com/tokentxns?a=${address}&p=1`)
        .then((res) => res.text())
        .then((result) => {
          const $ = cheerio.load(result);
          cheerioTableparser($);
          const resChe = $("table").parsetable(true, true, true);
          const [hide, TxnHash, timestamp, age, from, outin, to, value, tokenName] = resChe;
          for (let i = 1; i < hide.length; i++) {
            message.push({
              TxnHash: TxnHash[i],
              timestamp: timestamp[i],
              age: age[i],
              from: from[i],
              outin: outin[i],
              to: to[i],
              value: value[i],
              tokenName: tokenName[i],
            });
          }
          resolve({
            success: true,
            message,
          });
        })
        .catch((err) => reject(err));
    } catch (err) {
      resolve({
        success: false,
        message: err.message,
      });
    }
  });

(async () => {
  const address = process.argv[2];
  const readFunctionBscAddress = await functionBscAddress(address);
  console.log(readFunctionBscAddress);
})();
