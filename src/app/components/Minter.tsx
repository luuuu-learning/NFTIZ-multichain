import * as React from "react";
import { useState } from "react";
import "../styles/ui.css";

const isTestnet = process.env.IS_TESTNET;
const tatumApiKey = process.env.TATUM_API_KEY;

console.log(isTestnet);
console.log(tatumApiKey);

const tatumUploadToIpfsUrl = "https://api-eu1.tatum.io/v3/ipfs";
const tatumMintUrl = "https://api-eu1.tatum.io/v3/nft/mint";
const toIpfsUrl = (ipfsHash: string) => "ipfs://" + ipfsHash;
const toIpfsHttpUrl = (ipfsHash: string) => "https://ipfs.io/ipfs/" + ipfsHash;

const Minter = ({}) => {
  // const [ipfsUrl, SetIpfsUrl] = useState("");
  // const [ipfsHash, SetIpfsHash] = useState("");
  const [imageUrl, SetImageUrl] = useState("");
  // const [externalUrl, SetExternalUrl] = useState("");
  const [isLoading, SetIsLoading] = useState(true);
  // const [isError, SetIsError] = useState(false);
  // const [errorType, SetErrorType] = useState("");
  // const [oSLink, setOSLink] = useState("https://opensea.io/");
  const [mintResult, setMintResult] = useState([]);
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

  const Spinner = () => {
    return (
      <div id="spinnerHolder">
        <div id="spinner"></div>
        <h2>Minting ...</h2>
      </div>
    );
  };

  const RenderSuccess = () => {
    return (
      <div>
        <h3 className="v2_26">NFT MINTED ✅</h3>
        <ul className="fullclick">
          <li key="uniqueId1">
            <form target="_blank">
              <button id="result_ipfs" formAction={imageUrl}>
                💾 See your image stored on IPFS
              </button>
            </form>
          </li>
          <li key="uniqueId2">
            <form target="_blank">{mintResult}</form>
          </li>
        </ul>
      </div>
    );
  };

  //   const RenderError = () => {
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

  window.onmessage = (event) => {
    const { type, bytes, name, desc, addresses } = event.data.pluginMessage;
    if (type === "run") {
      const fetchTatum = (data) => {
        return fetch(tatumUploadToIpfsUrl, {
          method: "POST",
          headers: {
            "x-api-key": tatumApiKey,
          },
          body: data,
        });
      };
      const uploadImage = async () => {
        const formData = new FormData();
        formData.append("file", new Blob([bytes]));
        return await fetchTatum(formData).then((response) => {
          return response
            .json()
            .then((json) => {
              const hash = json.ipfsHash;
              console.log("IPFS http url: ", toIpfsHttpUrl(hash));
              SetImageUrl(toIpfsHttpUrl(hash));
              // SetIpfsHash(hash)
              return hash;
            })
            .catch((error) => {
              throw error;
            });
        });
      };

      const uploadMeta = async (imageIpfsHash: string) => {
        const data_up = JSON.stringify({
          name: name,
          description: desc,
          image: toIpfsUrl(imageIpfsHash),
        });
        const formData = new FormData();
        formData.append("file", new Blob([data_up]));
        return await fetchTatum(formData).then((response) => {
          return response
            .json()
            .then((json) => {
              const hash = json.ipfsHash;
              console.log("metadata IPFS url: " + toIpfsHttpUrl(hash));
              return hash;
            })
            .catch((error) => {
              throw error;
            });
        });
      };

      const callTatumToMint = async (data) => {
        let txId = "";
        let error = "";
        const response = await fetch(tatumMintUrl, {
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
      };

      const generateResult = (chain, txId, error) => {
        if (txId) {
          let explorerUrl = chain.explorerPrefix + txId;
          if (isTestnet && chain.name === "solana") {
            explorerUrl = explorerUrl + "?cluster=devnet";
          }
          console.log(explorerUrl);
          return (
            <button className={chain.name} formAction={explorerUrl}>
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
      };

      const mintWithMeta = async (metaIpfsHash, imageIpfsHash) => {
        if (addresses.algorand !== "") {
          const { txId, error } = await callTatumToMint(
            JSON.stringify({
              chain: "ALGO",
              to: addresses.algorand,
              url: toIpfsUrl(metaIpfsHash),
              name: name,
            })
          );
          setAlgorand((prev) => ({ ...prev, txId: txId, error: error }));
          const result = generateResult(algorand, txId, error);
          setMintResult((prev) => [...prev, result]);
        }
        if (addresses.celo !== "") {
          const { txId, error } = await callTatumToMint(
            JSON.stringify({
              chain: "CELO",
              to: addresses.celo,
              url: toIpfsUrl(metaIpfsHash),
              feeCurrency: "CELO",
            })
          );
          setCelo((prev) => ({ ...prev, txId: txId, error: error }));
          const result = generateResult(celo, txId, error);
          setMintResult((prev) => [...prev, result]);
        }
        if (addresses.harmony !== "") {
          const { txId, error } = await callTatumToMint(
            JSON.stringify({
              chain: "ONE",
              to: addresses.harmony,
              url: toIpfsUrl(metaIpfsHash),
            })
          );
          setHarmony((prev) => ({ ...prev, txId: txId, error: error }));
          const result = generateResult(harmony, txId, error);
          setMintResult((prev) => [...prev, result]);
        }
        if (addresses.solana !== "") {
          const { txId, error } = await callTatumToMint(
            JSON.stringify({
              chain: "SOL",
              to: addresses.solana,
              url: toIpfsUrl(metaIpfsHash),
              metadata: {
                name: name + " " + desc,
                symbol: name,
                sellerFeeBasisPoints: 0,
                uri: toIpfsUrl(imageIpfsHash),
              },
            })
          );
          setSolana((prev) => ({ ...prev, txId: txId, error: error }));
          const result = generateResult(solana, txId, error);
          setMintResult((prev) => [...prev, result]);
        }
        SetIsLoading(false);
      };

      const run = async () => {
        const imageIpfsHash = await uploadImage();
        const metaIpfsHash = await uploadMeta(imageIpfsHash);
        await mintWithMeta(metaIpfsHash, imageIpfsHash);
        // setTimeout(() => {
        //   fetch_id(tx_hash);
        // }, 15000);
      };
      run();
    }
  };

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
