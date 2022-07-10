figma.showUI(__uiFiles__.main);
figma.ui.resize(330, 450);

figma.ui.onmessage = (msg) => {
  if (msg.type === "run_app") {
    async function getBytes() {
      if (figma.currentPage.selection.length !== 1) {
        figma.notify("You need to select only 1 frame");
      } else {
        const node = figma.currentPage.selection[0];
        if (node.type !== "FRAME") {
          figma.notify("You need to select a frame element");
        } else {
          const bytes = await node.exportAsync();

          figma.showUI(__uiFiles__.ui_second);
          figma.ui.resize(330, 450);
          // This is how figma responds back to the ui
          figma.ui.postMessage({
            type: "run",
            bytes: bytes,
            name: msg.name,
            desc: msg.desc,
            // address: msg.address,
          });
        }
      }
    }
    getBytes();
  } else if (msg.type === "run_app2") {
    async function getBytes2() {
      // if (figma.currentPage.selection.length !== 1) {
      //     figma.notify('You need to select only 1 frame')
      // }
      // else {
      //     const node = figma.currentPage.selection[0]
      //     if (node.type !== 'FRAME') {
      //         figma.notify('You need to select a frame element')
      //     }
      //     else {
      //         const bytes = await node.exportAsync();

      //         figma.showUI(__uiFiles__.ui_second);
      //         figma.ui.resize(330,450);
      //         // This is how figma responds back to the ui
      //         figma.ui.postMessage({
      //             type: 'run',
      //             bytes: bytes,
      //             name: msg.name,
      //             desc: msg.desc,
      //             // address: msg.address,
      //         });

      //     }
      // }
      figma.showUI(__uiFiles__.ui_third);
      figma.ui.resize(330, 450);
      // This is how figma responds back to the ui
      figma.ui.postMessage({
        type: "run",
        bytes: msg.bytes,
        name: msg.name,
        desc: msg.desc,
        address: msg.address,
      });
      console.log("get run_app2 msg from loader ui in controller");
    }
    getBytes2();
  } else figma.closePlugin();
};
