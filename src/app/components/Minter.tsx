// import fetch, { FormData, File, fileFrom } from 'node-fetch'
import * as React from "react";
import { useState } from "react";
import "../styles/ui.css";

const isTestnet = true;

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
    explorerPrefix: isTestnet
      ? "https://explorer.solana.com/tx/{}?cluster=testnet"
      : "https://explorer.solana.com/tx/",
  });

  const [finishedLoadingCount, SetfinishedLoadingCount] = useState(0);

  const enabledChains = [];

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
      // store image on ipfs
      async function main() {
        var url = "https://api-eu1.tatum.io/v3/ipfs";
        const formData = new FormData();
        formData.append("file", new Blob([bytes]));

        const result = await fetch(url, {
          method: "POST",
          headers: {
            "x-api-key": "6ee58b01-a9c1-44f3-a768-2e4998b2d9de",
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

      async function upload_meta(ipfs_url) {
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
            "x-api-key": "6ee58b01-a9c1-44f3-a768-2e4998b2d9de",
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
        await fetch("https://api-eu1.tatum.io/v3/nft/mint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "6ee58b01-a9c1-44f3-a768-2e4998b2d9de",
          },
          body: data,
        })
          .then((response) => {
            response.json().then((json) => {
              if (response.status !== 200) {
                error = json.message;
              } else {
                txId = json.txId;
              }
            });
          })
          .catch((err) => {
            throw err;
          });
        return { txId, error };
      }

      async function mint_with_meta(metadata, ipfs_url) {
        // const mintData = []
        if (addresses.algorand !== "") {
          enabledChains.push(algorand);
          const { txId, error } = await callTatum(
            JSON.stringify({
              chain: "ALGO",
              to: addresses.algorand,
              url: metadata,
              name: name,
            })
          );
          setAlgorand((prev) => ({ ...prev, txId, error }));
        }
        if (addresses.celo !== "") {
          enabledChains.push(celo);
          const { txId, error } = await callTatum(
            JSON.stringify({
              chain: "CELO",
              to: addresses.celo,
              url: metadata,
              feeCurrency: "CELO",
            })
          );
          setCelo((prev) => ({ ...prev, txId, error }));
        }
        if (addresses.harmony !== "") {
          enabledChains.push(harmony);
          const { txId, error } = await callTatum(
            JSON.stringify({
              chain: "ONE",
              to: addresses.harmony,
              url: metadata,
            })
          );
          setHarmony((prev) => ({ ...prev, txId, error }));
        }
        if (addresses.solana !== "") {
          enabledChains.push(solana);
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
          setSolana((prev) => ({ ...prev, txId, error }));
        }

        SetIsLoading(false);
      }

      //   function fetch_id(tx_hash) {
      //     fetch(
      //       "https://api.nftport.xyz/v0/mints/" + tx_hash + "?chain=polygon",
      //       {
      //         method: "GET",
      //         headers: {
      //           "Content-Type": "application/json",
      //           Authorization: process.env.NFTPORT_KEY,
      //         },
      //       }
      //     )
      //       .then((response) => {
      //         return response.json().then(function (json) {
      //           console.log(json.response);
      //           console.log(json.token_id);
      //           setOSLink(
      //             "https://opensea.io/assets/matic/0x7fc96cec611171f27c233f70128d04dd66c7a8c8/" +
      //               json.token_id
      //           );
      //         });
      //       })
      //       .catch((err) => {
      //         console.error(err);
      //       });
      //   }

      async function run() {
        const ipfs_url = await main();
        const meta_url = await upload_meta(ipfs_url);
        await mint_with_meta(meta_url, ipfs_url);
        // console.log(tx_hash);
        // setTimeout(() => {
        //   fetch_id(tx_hash);
        // }, 15000);
      }
      run();
    }
  };

  const results = () => {
    return enabledChains.map((enabledChain) => {
      const explorerUrl = enabledChain.explorerPrefix + enabledChain.txId;
      if (enabledChain.txId) {
        <button className="result_etherscan" formAction={explorerUrl}>
          📊 See your transaction on {enabledChain.name} explorer
        </button>;
      } else {
        <span id="result_error">
          Error mint NFT on {enabledChain.name}: {enabledChain.error}
        </span>;
      }
    });
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
              {/* <button id="result_etherscan" formAction={externalUrl}>
                📊 See your transaction on polygonscan
              </button> */}
              {results()}
            </form>
          </li>
        </ul>
      </div>
    );
  }

  function RenderError() {
    return (
      <div>
        <div>
          <h3 className="v2_26">Oups it seems that it's not working... </h3>
        </div>
        <div>
          <span id="result_error">Error: {errorType}</span>
        </div>
      </div>
    );
  }

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
