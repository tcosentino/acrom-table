import React from "react";
import ReactDOM from "react-dom";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";

import "./styles.css";
import BasicDemo from "./Demo/BasicDemo";
import AutoDemo from "./Demo/AutoDemo";
import PagedDemo from "./Demo/PagedDemo";

function App() {
  return (
    <div className="App">
      <h1>Acromrymex Data Table</h1>
      <Tabs>
        <TabList>
          <Tab>Basic</Tab>
          <Tab>Auto</Tab>
          <Tab>Paged</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <BasicDemo />
          </TabPanel>
          <TabPanel>
            <AutoDemo />
          </TabPanel>
          <TabPanel>
            <PagedDemo />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
