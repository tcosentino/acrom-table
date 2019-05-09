import React from "react";
import PagedDataTable from "../DataTable/PagedDataTable";
import demoData from "./demoData";

export default () => {
  return (
    <PagedDataTable
      selectable
      filterable
      idAttribute="id"
      columns={[
        { key: "id" },
        { key: "name" },
        { key: "job" },
        { key: "mathGrade", type: "percent" },
        { key: "birthday", type: "timeago" },
        { key: "wfh", type: "checkbox" }
      ]}
      data={demoData}
    />
  );
};
