import React from "react";
import ReactDOM from "react-dom";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";

import "./styles.css";
import BasicDemo from "./Demo/BasicDemo";
import AutoDemo from "./Demo/AutoDemo";

function App() {
  return (
    <div className="App">
      <h1>Acromrymex Data Table</h1>
      <Tabs>
        <TabList>
          <Tab>Basic</Tab>
          <Tab>Auto</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <BasicDemo />
          </TabPanel>
          <TabPanel>
            <AutoDemo />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
