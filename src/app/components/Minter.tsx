// import fetch, { FormData, File, fileFrom } from 'node-fetch'
import * as React from "react";
import { useState } from "react";
import "../styles/ui.css";

const Minter = ({}) => {
  const [ipfsUrl, SetIpfsUrl] = useState("");
  const [externalUrl, SetExternalUrl] = useState("");
  const [isLoading, SetIsLoading] = useState(true);
  const [isError, SetIsError] = useState(false);
  const [errorType, SetErrorType] = useState("");
  const [oSLink, setOSLink] = useState("https://opensea.io/");

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
    const address = addresses.celo;
    console.log(addresses);
    if (type === "run") {
      // store image on ipfs
      async function main() {
        // var url = "https://api.nft.storage/upload";
        var url = "https://api-eu1.tatum.io/v3/ipfs";
        // var data = new Blob([bytes], { type: "image/png" });
        const formData = new FormData();
        // formData.set('file-upload', abc, 'image.png')

        // const form = new FormData();
        formData.append("file", new Blob([bytes]));

        const result = await fetch(url, {
          method: "POST",
          headers: {
            // Authorization: process.env.NFT_STORAGE_KEY,
            // "Content-Type": "application/x-www-form-urlencoded",
            // "content-type": "multipart/form-data",
            "x-api-key": "6ee58b01-a9c1-44f3-a768-2e4998b2d9de",
          },
          body: formData,
        }).then((response) => {
          return response
            .json()
            .then(function (json) {
              const ipfsHash = json.ipfsHash;
              console.log("IPFS url: ", "https://ipfs.io/ipfs/" + ipfsHash);
              //   SetIpfsUrl("https://ipfs.io/ipfs/" + ipfsHash);
              //   return "https://ipfs.io/ipfs/" + ipfsHash;
              SetIpfsUrl("ipfs://" + ipfsHash);
              return "ipfs://" + ipfsHash;
            })
            .catch((error) => {
              throw error;
            });
        });
        return result;
      }

      async function upload_meta(name, desc, ipfs_url) {
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
            // Authorization: process.env.NFTPORT_KEY,
            // "Content-Type": "application/json",
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

      async function mint_with_meta(metadata, address) {
        const data = JSON.stringify({
          chain: "CELO",
          to: address,
          url: metadata,
          feeCurrency: "CELO",
        });

        const result_mint = await fetch(
          "https://api-eu1.tatum.io/v3/nft/mint",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "6ee58b01-a9c1-44f3-a768-2e4998b2d9de",
            },
            body: data,
          }
        )
          .then((response) => {
            if (response.status !== 200) {
              SetIsLoading(false);
              SetIsError(true);
              SetErrorType(response.json.toString());
            } else {
              return response.json().then((json) => {
                console.log("NFT minted! " + json.txId);
                SetIsLoading(false);
                SetExternalUrl(json.txId);
                return json.txId;
              });
            }
            // return response.json().then(function (json) {
            //   if (json.response === "OK") {
            //     console.log("NFT minted!");
            //     SetIsLoading(false);
            //     console.log("Status:", json.response);
            //     console.log("Transaction hash:", json.transaction_hash);
            //     console.log("Transaction url:", json.transaction_external_url);
            //     SetExternalUrl(json.transaction_external_url);
            //     console.log(response);
            //     return json.transaction_hash;
            //   } else if (json.response === "NOK") {
            //     SetIsLoading(false);
            //     SetIsError(true);
            //     SetErrorType(json.error);
            //   }
            // });
          })
          .catch((err) => {
            throw err;
          });
        return result_mint;
      }

      function fetch_id(tx_hash) {
        fetch(
          "https://api.nftport.xyz/v0/mints/" + tx_hash + "?chain=polygon",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: process.env.NFTPORT_KEY,
            },
          }
        )
          .then((response) => {
            return response.json().then(function (json) {
              console.log(json.response);
              console.log(json.token_id);
              setOSLink(
                "https://opensea.io/assets/matic/0x7fc96cec611171f27c233f70128d04dd66c7a8c8/" +
                  json.token_id
              );
            });
          })
          .catch((err) => {
            console.error(err);
          });
      }

      async function run() {
        const ipfs_url = await main();
        const meta_url = await upload_meta(name, desc, ipfs_url);
        const tx_hash = await mint_with_meta(meta_url, address);
        console.log(tx_hash);
        setTimeout(() => {
          fetch_id(tx_hash);
        }, 15000);
      }
      run();
    }
  };

  function RenderSuccess() {
    return (
      <div>
        <h3 className="v2_26">NFT MINTED ✅</h3>
        <p className="v2_28">
          Opensea can be a bit long to load the data, it can take 5 to 10
          minutes
        </p>
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
              <button id="result_etherscan" formAction={externalUrl}>
                📊 See your transaction on polygonscan
              </button>
            </form>
          </li>
          <li key="uniqueId3">
            <form target="_blank">
              <button id="result_os" formAction={oSLink}>
                ⛴ See your NFT on Opensea
              </button>
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
      {isLoading ? (
        <Spinner />
      ) : (
        [isError ? <RenderError /> : <RenderSuccess />]
      )}
    </div>
  );
};

export default Minter;
