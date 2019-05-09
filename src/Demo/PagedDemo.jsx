import React, { Component } from "react";
import orderBy from "lodash/orderBy";
import PagedDataTable from "../DataTable/PagedDataTable";
import demoData from "./demoData";

const requestData = (pageSize, page, sort, filtered) => {
  return new Promise((resolve, reject) => {
    // You can retrieve your data however you want, in this case, we will just use some local data.
    let filteredData = demoData;

    // You can use the filters in your request, but you are responsible for applying them.
    console.log({ filtered, filteredData, sort });
    if (filtered.length) {
      filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
        return filteredSoFar.filter(row => {
          return (row[nextFilter.id] + "").includes(nextFilter.value);
        });
      }, filteredData);
    }

    // You can also use the sorting in your request, but again, you are responsible for applying it.
    const sortedData =
      !sort || !sort.length
        ? filteredData
        : orderBy(
            filteredData,
            sort[0] === "-" ? sort.substring(1) : sort,
            sort[0] === "-" ? "desc" : "asc"
          );
    console.log({ pageSize, page });

    // You must return an object containing the rows of the current page, and optionally the total pages number.
    const res = {
      data: sortedData.slice(
        pageSize * (page - 1),
        pageSize * (page - 1) + pageSize
      ),
      totalItemCount: filteredData.length
    };

    // Here we'll simulate a server response with 500ms of delay.
    setTimeout(() => resolve(res), 500);
  });
};

class PagedDemo extends Component {
  state = {
    loading: false,
    data: [],
    totalCount: null
  };

  fetchData = ({ currentPage, pageSize, filter, sort }) => {
    console.log({ currentPage, pageSize, filter, sort });
    // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
    // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
    this.setState({ loading: true });
    // Request the data however you want.  Here, we'll use our mocked service we created earlier
    requestData(pageSize, currentPage, sort, filter).then(
      ({ data, totalItemCount }) => {
        // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
        console.log({
          data,
          totalItemCount,
          divide: totalItemCount / pageSize
        });
        this.setState({
          data,
          pages: Math.ceil(totalItemCount / pageSize),
          loading: false
        });
      }
    );
  };

  render() {
    const { loading, data, pages } = this.state;

    return (
      <PagedDataTable
        selectable
        filterable
        idAttribute="id"
        data={data}
        columns={[
          { key: "id" },
          { key: "name" },
          { key: "job" },
          { key: "mathGrade", type: "percent" },
          { key: "birthday", type: "timeago" },
          { key: "wfh", type: "checkbox" }
        ]}
        onFetchData={this.fetchData}
        loading={loading}
        pages={pages}
      />
    );
  }
}

export default PagedDemo;
