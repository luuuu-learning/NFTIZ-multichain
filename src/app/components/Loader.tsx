import * as React from "react";
import { useState } from "react";
import "../styles/ui.css";

const Loader = ({}) => {
  const [bytes, SetBytes] = useState([]);
  const [name, SetName] = useState("");
  const [desc, SetDesc] = useState("");
  window.onmessage = (event) => {
    const { type, bytes, name, desc } = event.data.pluginMessage;
    console.log(type);
    SetBytes(bytes);
    SetName(name);
    SetDesc(desc);
  };

  function MyForm() {
    const [address, SetAddress] = useState("");

    const handleSubmit = (event) => {
      event.preventDefault();
      if (address !== "") {
        parent.postMessage(
          { pluginMessage: { type: "run_app2", bytes, name, desc, address } },
          "*"
        );
      }
    };

    const onCancel = () => {
      parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
    };

    return (
      <div>
        <form>
          <div id="form_style">
            <label>
              Ethereum address*:{" "}
              <input
                id="form_input_add"
                type="text"
                value={address}
                onChange={(e) => SetAddress(e.target.value)}
                required
              />
            </label>
          </div>
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
      <p className="v2_26">
        To mint a NFT, you need first to select a Frame and then fulfil
        information needed
      </p>
      <MyForm />
    </div>
  );
};

export default Loader;
