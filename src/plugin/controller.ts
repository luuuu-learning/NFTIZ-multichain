figma.showUI(__uiFiles__.main);
figma.ui.resize(330, 450);

figma.ui.onmessage = (msg) => {
  if (msg.type === "run_address") {
    console.log("receive message in run_address");
    async function getBytes2() {
      if (figma.currentPage.selection.length !== 1) {
        figma.notify("You need to select only 1 frame");
      } else {
        const node = figma.currentPage.selection[0];
        if (node.type !== "FRAME") {
          figma.notify("You need to select a frame element");
        } else {
          // const bytes = await node.exportAsync();

          figma.showUI(__uiFiles__.ui_second);
          figma.ui.resize(330, 450);
          // This is how figma responds back to the ui
          figma.ui.postMessage({
            type: "collect_address",
            // bytes: bytes,
            name: msg.name,
            desc: msg.desc,
          });
          console.log("controller post message collect_address");
        }
      }
    }
    getBytes2();
  } else if (msg.type === "run_app") {
    async function getBytes1() {
      if (figma.currentPage.selection.length !== 1) {
        figma.notify("You need to select only 1 frame");
      } else {
        const node = figma.currentPage.selection[0];
        if (node.type !== "FRAME") {
          figma.notify("You need to select a frame element");
        } else {
          const bytes = await node.exportAsync();

          figma.showUI(__uiFiles__.ui_third);
          figma.ui.resize(330, 450);
          // This is how figma responds back to the ui
          figma.ui.postMessage({
            type: "mint",
            bytes: bytes,
            name: msg.name,
            desc: msg.desc,
            address: msg.address,
          });
        }
      }
    }
    getBytes1();
  } else figma.closePlugin();
};
