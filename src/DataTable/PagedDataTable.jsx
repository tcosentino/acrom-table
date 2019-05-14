import React, { Component } from "react";
import DataTable from "./DataTable";

class PagedDataTable extends Component {
  render() {
    const { data, columns, onFetchData, ...tableProps } = this.props;

    return (
      <DataTable
        manual
        data={data}
        columns={columns}
        onFetchData={tableState => {
          console.log("onFetchData");
          const { page, pageSize, sorted, filter } = tableState;
          const computedState = {
            currentPage: page + 1,
            pageSize: pageSize
          };

          if (sorted.length && sorted[0].desc) {
            computedState.sort = `-${sorted[0].id}`;
          } else if (sorted.length) {
            computedState.sort = sorted[0].id;
          }

          computedState.filter = filter;

          return onFetchData(computedState);
        }}
        {...tableProps}
      />
    );
  }
}

export default PagedDataTable;
