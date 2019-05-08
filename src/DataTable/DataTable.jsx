import React, { Component } from "react";
import reject from "lodash/reject";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {
  getLabelCell,
  getTimeagoCell,
  getCheckboxCell,
  getJsonCell,
  getPercentCell,
  getCellBase
} from "./DataTableCells";

class Cells extends Component {
  render() {
    return "a cell";
  }
}

class Column extends Component {
  render() {
    return "a cell";
  }
}

class DataTable extends Component {
  static Cells = Cells;
  static Column = Column;

  state = {
    // 0: none, 1: all, 2: some
    selectAll: 0,
    // toggled list because when select all is enabled, it is the unselected rows
    toggledList: []
  };

  getIdValue = original => {
    const { idAttribute } = this.props;

    return original[idAttribute];
  };

  isRowSelected = original => {
    const { toggledList } = this.state;
    const idValue = this.getIdValue(original);

    console.log(toggledList);

    return toggledList.indexOf(idValue) > -1;
  };

  toggleRow = original => {
    const { data } = this.props;
    const { toggledList } = this.state;
    const idValue = this.getIdValue(original);
    let newToggledList = [];
    let newSelectAll = 0;

    if (this.isRowSelected(original)) {
      newToggledList = [...reject(toggledList, s => s === idValue)];
    } else {
      newToggledList = [...toggledList, idValue];
    }

    if (newToggledList.length === data.length) {
      newSelectAll = 1;
    } else if (newToggledList.length > 0) {
      newSelectAll = 2;
    }

    this.setState({
      toggledList: newToggledList,
      selectAll: newSelectAll
    });
  };

  toggleSelectAll = () => {
    const { data } = this.props;
    const { selectAll } = this.state;
    console.log({ data, selectAll });
    const newToggledList = selectAll === 1 ? [] : data.map(this.getIdValue);

    this.setState({
      selectAll: selectAll === 1 ? 0 : 1,
      toggledList: newToggledList
    });
  };

  getColumns() {
    const { columns, selectable } = this.props;
    const { selectAll } = this.state;
    const returnColumns = [];

    console.log({ selectAll });

    if (selectable) {
      returnColumns.push({
        id: "checkbox",
        accessor: "",
        sortable: false,
        filterable: false,
        Cell: ({ original }) => (
          <input
            type="checkbox"
            className="checkbox"
            checked={this.isRowSelected(original)}
            onChange={() => this.toggleRow(original)}
          />
        ),
        Header: () => (
          <input
            type="checkbox"
            className="checkbox"
            checked={selectAll === 1}
            ref={input => {
              if (input) {
                input.indeterminate = selectAll === 2;
              }
            }}
            onChange={() => this.toggleSelectAll()}
          />
        ),
        width: 45
      });
    }

    returnColumns.push(
      ...columns.map(column => {
        const cell = getCellBase(column);

        switch (column.type) {
          case "json":
            return getJsonCell(column, cell);
          case "percent":
            return getPercentCell(column, cell);
          case "checkbox":
            return getCheckboxCell(column, cell);
          case "timeago":
            return getTimeagoCell(column, cell);
          default:
            return getLabelCell(column, cell);
        }
      })
    );

    return returnColumns;
  }

  render() {
    return (
      <ReactTable
        data={this.props.data}
        columns={this.getColumns()}
        className="-striped -highlight"
      />
    );
  }
}

export default DataTable;
