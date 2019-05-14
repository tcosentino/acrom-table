import React, { Component } from "react";
import PagedDataTable from "../DataTable/PagedDataTable";
import { requestData } from "./demoData";

class PagedDemo extends Component {
  state = {
    loading: false,
    data: [],
    totalIdList: [],
    totalCount: null
  };

  fetchData = ({ currentPage, pageSize, filter, sort }) => {
    this.setState({ loading: true });

    requestData(pageSize, currentPage, sort, filter).then(
      ({ data, totalItemCount, totalIdList }) => {
        this.setState({
          data,
          totalCount: totalItemCount,
          totalIdList,
          loading: false
        });
      }
    );
  };

  render() {
    const { loading, data, totalCount, totalIdList } = this.state;

    return (
      <PagedDataTable
        selectable
        filterable
        idAttribute="id"
        data={data}
        totalIdList={totalIdList}
        actions={[
          {
            display: "Action",
            onClick: selected => {
              console.log({ selected });
            }
          }
        ]}
        columns={[
          { key: "id", hidden: true },
          { key: "name" },
          { key: "job" },
          { key: "mathGrade", type: "percent" },
          { key: "birthday", type: "timeago" },
          { key: "wfh", type: "checkbox" }
        ]}
        onFetchData={this.fetchData}
        loading={loading}
        totalCount={totalCount}
      />
    );
  }
}

export default PagedDemo;
