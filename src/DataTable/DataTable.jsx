import React, { Component } from "react";
import reject from "lodash/reject";
import ReactTable from "react-table";
import { Icon } from "acromyrmex";
import { Button } from "react-bootstrap";
import {
  getLabelCell,
  getTimeagoCell,
  getCheckboxCell,
  getJsonCell,
  getPercentCell,
  getCellBase
} from "./DataTableCells";
import "react-table/react-table.css";
import "./DataTable.css";

class DataTable extends Component {
  state = {
    // 0: none, 1: all, 2: some
    selectAll: 0,
    // toggled list because when select all is enabled, it is the unselected rows
    toggledList: [],

    showFilters: false
  };

  wrapperRef = React.createRef();

  getIdValue = original => {
    const { idAttribute } = this.props;

    return original[idAttribute];
  };

  isRowSelected = original => {
    const { toggledList } = this.state;
    const idValue = this.getIdValue(original);

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
    const newToggledList = selectAll === 1 ? [] : data.map(this.getIdValue);

    this.setState({
      selectAll: selectAll === 1 ? 0 : 1,
      toggledList: newToggledList
    });
  };

  getSelectableColumn() {
    const { selectAll } = this.state;
    return {
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
    };
  }

  getColumns() {
    const { columns, selectable } = this.props;
    const { selectAll } = this.state;
    const returnColumns = [];

    if (selectable) {
      returnColumns.push(this.getSelectableColumn());
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
          case "date":
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
    const { filterable, toolbar, ...tableProps } = this.props;
    const { toggledList, showFilters } = this.state;

    return (
      <div style={{ height: "100%" }} ref={this.wrapperRef}>
        <div className="toolbar clearfix">
          <div className="pull-right">
            <strong>{`${toggledList.length} Selected`}</strong>
          </div>
          {filterable && (
            <div className="pull-left">
              <Button
                bsStyle="primary"
                bsSize="xs"
                active={showFilters}
                onClick={() => this.setState({ showFilters: !showFilters })}
              >
                <Icon filter />
                {" Filter"}
              </Button>
            </div>
          )}
          {toolbar}
        </div>
        <ReactTable
          {...tableProps}
          className="-striped -highlight"
          style={{
            // 30px is the height of the toolbar
            height: "calc(100% - 30px)"
          }}
          data={this.props.data}
          columns={this.getColumns()}
          filterable={showFilters}
          defaultFilterMethod={(filter, row) => {
            // date filter
            if (filter.value && (filter.value.to || filter.value.from)) {
              if (filter.value.to && !filter.value.from) {
                return filter.value.to > row[filter.id];
              }
              if (filter.value.from && !filter.value.to) {
                return filter.value.from < row[filter.id];
              }
              return (
                filter.value.to > row[filter.id] &&
                filter.value.from < row[filter.id]
              );
            }

            // normal filter
            return String(row[filter.id]) === filter.value;
          }}
          getTbodyProps={() => ({
            onScroll: e => {
              let headers = this.wrapperRef.current.getElementsByClassName(
                "rt-thead"
              );
              console.log(e.target.scrollLeft);
              console.log(headers);
              for (let i = 0; i < headers.length; i++) {
                headers[i].scrollLeft = e.target.scrollLeft;
              }
            }
          })}
          getTheadThProps={() => ({
            style: {}
          })}
          // this helps fix horizontal scrolling
          // TbodyComponent={TbodyComponent}
          // TrGroupComponent={TrGroupComponent}
        />
      </div>
    );
  }
}
// handleScroll(event) {
//   console.log(event.target.scrollLeft);
//   let headers = document.getElementsByClassName("rt-thead");
//   for (let i = 0; i < headers.length; i++) {
//     headers[i].scrollLeft = event.target.scrollLeft;
//   }
// }

export default DataTable;
