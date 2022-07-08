import * as React from "react";
import { useState } from "react";
import "../styles/ui.css";

declare function require(path: string): any;

const Address = ({}) => {
  const [address, SetAddress] = useState("");
  const [name, SetName] = useState("");
  const [desc, SetDesc] = useState("");
  SetName("");
  SetDesc("");
  // window.onmessage = (event) => {
  //     console.log('addressCollector receive message collect_address')
  //     const {type, name, desc} = event.data.pluginMessage;
  //     console.log('window.onmessage in addressCollector')
  //     if (type === 'collect_address') {
  //         SetName(name);
  //         SetDesc(desc);
  //     }
  // }

  function MyForm() {
    const handleSubmit = (event) => {
      event.preventDefault();
      if (address !== "") {
        parent.postMessage(
          { pluginMessage: { type: "run_address", name, desc, address } },
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
              Polygon address*:{" "}
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
      <p className="v2_26">Please enter your addresses on below chains</p>
      <MyForm />
    </div>
  );
};

export default Address;
