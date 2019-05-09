import React from "react";
import DataTable from "../DataTable/DataTable";

export default () => {
  return (
    <DataTable
      selectable
      idAttribute="id"
      data={[
        {
          id: 1,
          name: "troy",
          job: "dev",
          mathGrade: 0.25,
          birthday: new Date("1992-03-12T17:38:03.182Z"),
          wfh: "true"
        },
        {
          id: 2,
          name: "joey",
          job: "finance",
          mathGrade: 0.75,
          birthday: "1991-08-06T17:38:03.182Z",
          wfh: false
        }
      ]}
      columns={[
        { key: "id" },
        { key: "name" },
        { key: "job" },
        { key: "mathGrade", type: "percent" },
        { key: "birthday", type: "timeago" },
        { key: "wfh", type: "checkbox" }
      ]}
    />
  );
};
