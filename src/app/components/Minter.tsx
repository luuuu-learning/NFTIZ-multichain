// import fetch, { FormData, File, fileFrom } from 'node-fetch'
import * as React from "react";
import { useState } from "react";
import "../styles/ui.css";

const isTestnet = process.env.IS_TESTNET;
const tatumApiKey = process.env.TATUM_API_KEY;

console.log(isTestnet);
console.log(tatumApiKey);

const Minter = ({}) => {
  const [ipfsUrl, SetIpfsUrl] = useState("");
  const [externalUrl, SetExternalUrl] = useState("");
  const [isLoading, SetIsLoading] = useState(true);
  const [isError, SetIsError] = useState(false);
  const [errorType, SetErrorType] = useState("");
  const [oSLink, setOSLink] = useState("https://opensea.io/");

  const [algorand, setAlgorand] = useState({
    name: "algorand",
    explorerPrefix: isTestnet
      ? "https://testnet.algoexplorer.io/tx/"
      : "https://algoexplorer.io/tx/",
  });
  const [celo, setCelo] = useState({
    name: "celo",
    explorerPrefix: isTestnet
      ? "https://alfajores-blockscout.celo-testnet.org/tx/"
      : "https://explorer.testnet.celo.org/tx/",
  });
  const [harmony, setHarmony] = useState({
    name: "harmony",
    explorerPrefix: isTestnet
      ? "https://explorer.testnet.harmony.one/tx/"
      : "https://explorer.harmony.one/tx/",
  });
  const [solana, setSolana] = useState({
    name: "solana",
    explorerPrefix: "https://explorer.solana.com/tx/",
  });

  const [mintResult, setMintResult] = useState([]);

  function Spinner() {
    return (
      <div id="spinnerHolder">
        <div id="spinner"></div>
        <h2>Minting ...</h2>
      </div>
    );
  }

  window.onmessage = (event) => {
    const { type, bytes, name, desc, addresses } = event.data.pluginMessage;
    if (type === "run") {
      async function uploadImage() {
        var url = "https://api-eu1.tatum.io/v3/ipfs";
        const formData = new FormData();
        formData.append("file", new Blob([bytes]));

        const result = await fetch(url, {
          method: "POST",
          headers: {
            "x-api-key": tatumApiKey,
          },
          body: formData,
        }).then((response) => {
          return response
            .json()
            .then(function (json) {
              const ipfsHash = json.ipfsHash;
              console.log("IPFS url: ", "https://ipfs.io/ipfs/" + ipfsHash);
              SetIpfsUrl("ipfs://" + ipfsHash);
              return "ipfs://" + ipfsHash;
            })
            .catch((error) => {
              throw error;
            });
        });
        return result;
      }

      async function uploadMeta(ipfs_url) {
        var url = "https://api-eu1.tatum.io/v3/ipfs";
        const data_up = JSON.stringify({
          name: name,
          description: desc,
          image: ipfs_url,
        });
        const formData = new FormData();
        formData.append("file", new Blob([data_up]));

        const result_up = await fetch(url, {
          method: "POST",
          headers: {
            "x-api-key": tatumApiKey,
          },
          body: formData,
        }).then((response) => {
          return response
            .json()
            .then(function (json) {
              const ipfsHash = json.ipfsHash;
              console.log(
                "metadata IPFS url: ",
                "https://ipfs.io/ipfs/" + ipfsHash
              );
              return "ipfs://" + ipfsHash;
            })
            .catch((error) => {
              throw error;
            });
        });
        return result_up;
      }

      async function callTatum(data) {
        let txId = "";
        let error = "";
        const response = await fetch("https://api-eu1.tatum.io/v3/nft/mint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": tatumApiKey,
          },
          body: data,
        });

        const json = await response.json();

        if (response.status !== 200) {
          error = json.message;
        } else {
          txId = json.txId;
        }
        return { txId, error };
      }

      function generateResult(chain, txId, error) {
        if (txId) {
          let explorerUrl = chain.explorerPrefix + txId;
          if (isTestnet && chain.name === "solana") {
            explorerUrl = explorerUrl + "?cluster=devnet";
          }
          console.log(explorerUrl);
          return (
            <button className="result_etherscan" formAction={explorerUrl}>
              📊 See your transaction on {chain.name} explorer
            </button>
          );
        } else if (error) {
          return (
            <span id="result_error">
              Error mint NFT on {chain.name}: {error}
            </span>
          );
        } else {
          return (
            <span id="result_error">
              Error mint NFT on {chain.name}: unknown error
            </span>
          );
        }
      }

      async function mintWithMeta(metadata, ipfs_url) {
        // const mintData = []
        if (addresses.algorand !== "") {
          const { txId, error } = await callTatum(
            JSON.stringify({
              chain: "ALGO",
              to: addresses.algorand,
              url: metadata,
              name: name,
            })
          );
          setAlgorand((prev) => ({ ...prev, txId: txId, error: error }));
          const result = generateResult(algorand, txId, error);
          setMintResult((prev) => [...prev, result]);
        }
        if (addresses.celo !== "") {
          const { txId, error } = await callTatum(
            JSON.stringify({
              chain: "CELO",
              to: addresses.celo,
              url: metadata,
              feeCurrency: "CELO",
            })
          );
          setCelo((prev) => ({ ...prev, txId: txId, error: error }));
          const result = generateResult(celo, txId, error);
          setMintResult((prev) => [...prev, result]);
        }
        if (addresses.harmony !== "") {
          const { txId, error } = await callTatum(
            JSON.stringify({
              chain: "ONE",
              to: addresses.harmony,
              url: metadata,
            })
          );
          setHarmony((prev) => ({ ...prev, txId: txId, error: error }));
          const result = generateResult(harmony, txId, error);
          setMintResult((prev) => [...prev, result]);
        }
        if (addresses.solana !== "") {
          const { txId, error } = await callTatum(
            JSON.stringify({
              chain: "SOL",
              to: addresses.solana,
              url: metadata,
              metadata: {
                name: name + " " + desc,
                symbol: name,
                sellerFeeBasisPoints: 0,
                uri: ipfs_url,
              },
            })
          );
          setSolana((prev) => ({ ...prev, txId: txId, error: error }));
          const result = generateResult(solana, txId, error);
          setMintResult((prev) => [...prev, result]);
        }
        SetIsLoading(false);
      }

      async function run() {
        const ipfs_url = await uploadImage();
        const meta_url = await uploadMeta(ipfs_url);
        await mintWithMeta(meta_url, ipfs_url);
        // setTimeout(() => {
        //   fetch_id(tx_hash);
        // }, 15000);
      }
      run();
    }
  };

  function RenderSuccess() {
    return (
      <div>
        <h3 className="v2_26">NFT MINTED ✅</h3>
        <ul className="fullclick">
          <li key="uniqueId1">
            <form target="_blank">
              <button id="result_ipfs" formAction={ipfsUrl}>
                💾 See your image stored on IPFS
              </button>
            </form>
          </li>
          <li key="uniqueId2">
            <form target="_blank">
              {mintResult}
              {/* {/* <button id="result_etherscan" formAction={externalUrl}>
                📊 See your transaction on polygonscan
              </button> */}
              {/* {results()}
              {results.length} */}
            </form>
          </li>
        </ul>
      </div>
    );
  }

  //   function RenderError() {
  //     return (
  //       <div>
  //         <div>
  //           <h3 className="v2_26">Oups it seems that it's not working... </h3>
  //         </div>
  //         <div>
  //           <span id="result_error">Error: {errorType}</span>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div>
      <div>
        <div className="v2_25"></div>
      </div>
      {isLoading ? <Spinner /> : [<RenderSuccess />]}
    </div>
  );
};

export default Minter;
