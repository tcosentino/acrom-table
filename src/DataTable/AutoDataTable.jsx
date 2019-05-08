import React, { Component } from "react";
import each from "lodash/each";
import DataTable from "./DataTable";

class AutoDataTable extends Component {
  getColumns = () => {
    const { data } = this.props;
    const columns = [];

    data.forEach(row => {
      each(row, (value, key) => {
        // if we have already added a column for this key, skip it
        if (columns.find(c => c.key === key)) {
          return;
        }

        console.log({ value, key });
        columns.push({ key });
      });
    });

    console.log(columns);
    return columns;
  };

  render() {
    const { data } = this.props;

    console.log(this.getColumns());
    return <DataTable data={data} columns={this.getColumns()} />;
  }
}

export default AutoDataTable;
