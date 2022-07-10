import * as React from "react";
import { useState } from "react";
import Select from "react-select";
import "../styles/ui.css";

declare function require(path: string): any;

const App = ({}) => {
  function MyForm() {
    const [name, SetName] = useState("");
    const [desc, SetDesc] = useState("");
    const [selectChains, setSelectChains] = useState([]);

    const handleSubmit = (event) => {
      event.preventDefault();
      if (name !== "" && desc !== "" && selectChains.length > 0) {
        parent.postMessage(
          { pluginMessage: { type: "run_app", name, desc, selectChains } },
          "*"
        );
      }
    };

    const handleSelect = (chains) => {
      setSelectChains(chains);
    };

    const onCancel = () => {
      parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
    };

    const supportChains = [
      { value: "solana", label: "Solana" },
      { value: "algorand", label: "Algorand" },
      { value: "celo", label: "Celo" },
      { value: "harmony", label: "Harmony" },
    ];

    return (
      <div>
        <form>
          <div id="form_style">
            <label>
              Name*:{" "}
              <input
                id="form_input_name"
                type="text"
                value={name}
                onChange={(e) => SetName(e.target.value)}
                required
              />
            </label>
            <label>
              Description*:{" "}
              <textarea
                id="form_input_desc"
                rows={3}
                value={desc}
                onChange={(e) => SetDesc(e.target.value)}
                required
              />
            </label>
            <label>
              Select Chains*:
              <Select
                // defaultValue={[colourOptions[2], colourOptions[3]]}
                isMulti
                name="colors"
                options={supportChains}
                onChange={handleSelect}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </label>
          </div>
          <button type="submit" id="mint_button" onClick={handleSubmit}>
            Next
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

export default App;
