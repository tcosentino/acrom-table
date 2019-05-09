import React, { Component } from "react";
import DataTable from "./DataTable";

class PagedDataTable extends Component {
  render() {
    const { data, columns, ...tableProps } = this.props;

    return <DataTable data={data} columns={columns} {...tableProps} />;
  }
}

export default PagedDataTable;
