import React, { Component } from "react";
import reject from "lodash/reject";
import without from "lodash/without";
import ReactTable from "react-table";
import { Icon } from "acromyrmex";
import { Button, OverlayTrigger, Popover, Checkbox } from "react-bootstrap";
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
  static defaultProps = {
    totalCount: null,
    actions: []
  };

  state = {
    // 0: none, 1: all, 2: some
    selectAll: 0,
    // toggled list because when select all is enabled, it is the unselected rows
    toggledList: [],
    pageSize: 20,
    // this is the format we use
    filter: {},
    // this is the format that the table uses
    filtered: [],

    columnShowList: this.props.columns.map(c => ({
      key: c.key,
      hidden: c.hidden
    })),

    showFilters: false
  };

  wrapperRef = React.createRef();

  componentDidUpdate(prevProps, prevState) {
    this.updateHeaderScrollPosition();
    const { data, totalCount } = this.props;
    const { toggledList } = this.state;

    if (
      data.length !== prevProps.data.length ||
      totalCount !== prevProps.totalCount ||
      toggledList.length !== (prevState.toggledList || []).length
    ) {
      this.setState({
        selectAll: this.determineSelectAll()
      });
    }
  }

  updateHeaderScrollPosition() {
    const { scrollLeft } = this.state;
    const { current: wrapper } = this.wrapperRef;
    let headers = wrapper.getElementsByClassName("rt-thead");

    for (let i = 0; i < headers.length; i++) {
      headers[i].scrollLeft = scrollLeft;
    }
  }

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
    const { toggledList } = this.state;
    const idValue = this.getIdValue(original);
    let newToggledList = [];

    if (this.isRowSelected(original)) {
      newToggledList = [...reject(toggledList, s => s === idValue)];
    } else {
      newToggledList = [...toggledList, idValue];
    }

    this.setState({
      toggledList: newToggledList,
      selectAll: this.determineSelectAll({ newToggledList })
    });
  };

  determineSelectAll({
    newToggledList = this.state.toggledList,
    newData = this.props.data,
    newTotalCount = this.props.totalCount,
    newTotalIdList = this.props.totalIdList
  } = {}) {
    const intersectedToggleList = newToggledList.filter(id =>
      newTotalIdList.find(d => d === id)
    );

    if (intersectedToggleList.length === (newTotalCount || newData.length)) {
      return 1;
    } else if (intersectedToggleList.length > 0) {
      return 2;
    }

    return 0;
  }

  toggleSelectAll = () => {
    const { data, totalIdList, manual } = this.props;
    const { selectAll, toggledList } = this.state;

    let newToggledList;
    if (manual) {
      newToggledList =
        selectAll === 1 ? without(toggledList, ...totalIdList) : totalIdList;
    } else {
      newToggledList = selectAll === 1 ? [] : data.map(this.getIdValue);
    }

    this.setState({
      toggledList: newToggledList,
      selectAll: this.determineSelectAll({ newToggledList })
    });
  };

  getSelectableColumn() {
    const { selectAll } = this.state;
    return {
      id: "checkbox",
      accessor: "",
      sortable: false,
      filterable: false,
      toggleable: false,
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
      ...columns
        .filter(c => {
          const { columnShowList } = this.state;
          const thisCol = columnShowList.find(col => c.key === col.key);

          return !thisCol.hidden;
        })
        .map(column => {
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

  getPageSizeOptions() {
    const { data, totalCount } = this.props;
    const pageSizeOptions = [5, 10, 20, 25, 50, 100].filter(
      n => n < (totalCount || data.length)
    );

    if (
      (totalCount || data.length) < 100 &&
      pageSizeOptions.indexOf(data.length) < 0
    ) {
      pageSizeOptions.push(data.length);
    }

    return pageSizeOptions;
  }

  getToolbar() {
    const { actions, toolbar } = this.props;
    const { toggledList } = this.state;

    return (
      <div>
        {actions.map(action => (
          <div className="pull-left">
            <Button
              bsStyle={action.style || "success"}
              bsSize="xs"
              onClick={() => {
                action.onClick(toggledList);
              }}
            >
              {action.display}
            </Button>
          </div>
        ))}
        {toolbar}
      </div>
    );
  }

  getColumnPopover() {
    const columns = this.props.columns;

    return (
      <Popover id="popover-basic">
        {columns.map(column => {
          const { columnShowList } = this.state;
          const thisCol = columnShowList.find(col => column.key === col.key);

          return (
            <Checkbox
              checked={!thisCol.hidden}
              onClick={() => {
                const { columnShowList } = this.state;
                const newColList = [...columnShowList];
                const thisCol = newColList.find(col => column.key === col.key);

                thisCol.hidden = !thisCol.hidden;
                this.setState({ columnShowList: newColList });
              }}
            >
              {column.display || column.key}
            </Checkbox>
          );
        })}
      </Popover>
    );
  }

  render() {
    const {
      data,
      filterable,
      toolbar,
      defaultPageSize,
      totalCount,
      onFetchData,
      ...tableProps
    } = this.props;
    const { toggledList, showFilters, pageSize, filter, filtered } = this.state;
    const addedProps = {};

    if (totalCount !== null) {
      addedProps.pages = Math.ceil(totalCount / pageSize);
    }

    return (
      <div style={{ height: "100%" }} ref={this.wrapperRef}>
        <div className="toolbar clearfix">
          <div className="pull-right">
            <strong>{`${toggledList.length} Selected`}</strong>
          </div>
          <div className="pull-left">
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={this.getColumnPopover()}
            >
              <Button bsStyle="primary" bsSize="xs">
                Toggle Columns
              </Button>
            </OverlayTrigger>
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
          {Object.keys(filter).length > 0 && (
            <div className="pull-left">
              <Button
                bsStyle="danger"
                bsSize="xs"
                onClick={() => this.setState({ filtered: [] })}
              >
                <Icon filter />
                {" Clear Filter"}
              </Button>
            </div>
          )}
          {this.getToolbar()}
        </div>
        <ReactTable
          {...tableProps}
          {...addedProps}
          pageSize={pageSize}
          onPageSizeChange={pageSize => this.setState({ pageSize })}
          className="-striped -highlight"
          style={{
            // 30px is the height of the toolbar
            height: "calc(100% - 30px)"
          }}
          data={data}
          columns={this.getColumns()}
          pageSizeOptions={this.getPageSizeOptions()}
          filterable={filterable}
          filtered={filtered}
          onFilteredChange={filtered => {
            this.setState({ filtered });
          }}
          onFetchData={tableState => {
            const { filtered } = tableState;

            const filter = {};
            if (filtered) {
              filtered.forEach(f => {
                filter[f.id] = f.value;
              });

              this.setState({ filter });
            }

            if (!onFetchData) {
              return;
            }

            return onFetchData({ ...tableState, filter });
          }}
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
            // to keep the header and body in sync, we need to track scrolling of the body
            onScroll: e => {
              this.setState({ scrollLeft: e.target.scrollLeft });
            }
          })}
          getTheadFilterProps={(state, rowInfo, column, instance) => {
            return {
              style: showFilters ? null : { display: "none" }
            };
          }}
        />
      </div>
    );
  }
}

export default DataTable;
