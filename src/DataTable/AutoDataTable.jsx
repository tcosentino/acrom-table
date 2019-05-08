import React, { Component } from "react";
import each from "lodash/each";
import DataTable from "./DataTable";
import isDate from "lodash/isDate";
import isBoolean from "lodash/isBoolean";
import isObject from "lodash/isObject";
import isArray from "lodash/isArray";
import isUndefined from "lodash/isUndefined";

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

        let type;
        if (isDate(value)) {
          type = "date";
        } else if (isBoolean(value)) {
          type = "checkbox";
        } else if (isObject(value) || isArray(value)) {
          type = "json";
        }

        columns.push({ key, type });
      });
    });

    // go through string columns to check for certain conditions
    console.log({ columns });
    columns
      .filter(c => !c.type)
      .forEach(column => {
        console.log({ column });
        let allBoolStrings = true;

        data.forEach(row => {
          const val = isUndefined(row[column.key])
            ? ""
            : row[column.key].toString();

          console.log(val);
          if (val !== "true" && val !== "false") {
            allBoolStrings = false;
          }
        });

        if (allBoolStrings) {
          column.type = "checkbox";
        }
      });

    return columns;
  };

  render() {
    const { data } = this.props;

    return <DataTable data={data} columns={this.getColumns()} />;
  }
}

export default AutoDataTable;
