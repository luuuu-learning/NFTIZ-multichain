import * as React from "react";
import { useState } from "react";
import "../styles/ui.css";

const Loader = ({}) => {
  const [bytes, SetBytes] = useState([]);
  const [name, SetName] = useState("");
  const [desc, SetDesc] = useState("");
  const [chains, SetChains] = useState([]);

  const [algorandAddress, SetAlgorandAddress] = useState("");
  const [celoAddress, SetCeloAddress] = useState("");
  const [harmonyAddress, SetHarmonyAddress] = useState("");
  const [solanaAddress, SetSolanaAddress] = useState("");
  const addressMap = {
    algorand: { value: algorandAddress, setter: SetAlgorandAddress },
    celo: { value: celoAddress, setter: SetCeloAddress },
    harmony: { value: harmonyAddress, setter: SetHarmonyAddress },
    solana: { value: solanaAddress, setter: SetSolanaAddress },
  };

  window.onmessage = (event) => {
    const { type, bytes, name, desc, chains } = event.data.pluginMessage;
    console.log(type);
    SetBytes(bytes);
    SetName(name);
    SetDesc(desc);
    SetChains(chains);
  };

  function MyForm() {
    const handleSubmit = (event) => {
      event.preventDefault();
      // as long as use entered address on one chain
      if (
        algorandAddress !== "" ||
        celoAddress !== "" ||
        harmonyAddress !== "" ||
        solanaAddress !== ""
      ) {
        parent.postMessage(
          {
            pluginMessage: {
              type: "run_app2",
              bytes,
              name,
              desc,
              addresses: {
                algorand: algorandAddress,
                celo: celoAddress,
                harmony: harmonyAddress,
                solana: solanaAddress,
              },
            },
          },
          "*"
        );
      }
    };

    const onCancel = () => {
      parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
    };

    const collector = () => {
      const addresses = [];
      for (const chain of chains) {
        const chainName = chain.value;
        addresses.push(
          <label key={chainName}>
            {chainName} address*:{" "}
            <input
              id="form_input_add"
              type="text"
              value={addressMap[chainName].value}
              onChange={(e) => addressMap[chainName].setter(e.target.value)}
              required
            />
          </label>
        );
      }
      return addresses;
    };

    return (
      <div>
        <form>
          <div id="form_style">{chains ? collector() : null}</div>
          <button type="submit" id="mint_button" onClick={handleSubmit}>
            Mint
          </button>
          <button id="close_button" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="v2_25"></div>
      </div>
      <p className="v2_26">Please enter your addresses on selected chains</p>
      <MyForm />
    </div>
  );
};

export default Loader;
