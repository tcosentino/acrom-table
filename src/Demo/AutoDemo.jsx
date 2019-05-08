import React from "react";
import AutoDataTable from "../DataTable/AutoDataTable";

export default () => {
  return (
    <AutoDataTable
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
          birthday: "1991-08-06T17:38:03.182Z",
          wfh: false
        }
      ]}
    />
  );
};
