import React, { Component } from "react";
import moment from "moment";
import isString from "lodash/isString";
import ReactJson from "react-json-view";
import { ProgressBar } from "react-bootstrap";
import { DateInput } from "acromyrmex";
import { toBoolean } from "./DataConversion";

const getCellBase = column => ({
  Header: column.display || column.key,
  accessor: column.key,
  width: column.width || 150
});

const getLabelCell = (column, cell) => ({
  ...cell,
  Cell: r => r.value
});

const getJsonCell = (column, cell) => ({
  ...cell,
  Cell: r => {
    let obj = null;
    try {
      obj = isString(r.value) ? JSON.parse(r.value) : r.value;
    } catch (e) {
      // nothing
    }
    return (
      obj && (
        <div className="overflow">
          <ReactJson name={null} collapsed src={obj} displayDataTypes={false} />
        </div>
      )
    );
  }
});

const getPercentCell = (column, cell) => ({
  ...cell,
  Cell: r => (
    <div style={{ minWidth: "150px" }}>
      <ProgressBar
        now={r.value * 100}
        label={`${Math.floor(r.value * 100)}%`}
      />
    </div>
  )
});

const getTimeagoCell = (column, cell) => ({
  ...cell,
  width: 225,
  Cell: r => {
    const momentDate = moment(r.value);
    const today = moment().diff(momentDate, "days") >= 1;
    let text = "";

    text += today
      ? momentDate.format("MMMM D [at] h:mm A")
      : momentDate.format("h:mm A");

    return <span>{text}</span>;
  },
  Filter: ({
    filter = {
      id: "birthday",
      value: { from: "", to: "" }
    },
    onChange
  }) => (
    <div className="date-filter">
      <DateInput
        label="From"
        input={{
          value: filter.value.from,
          onChange: value => {
            onChange({ ...filter.value, from: value });
          }
        }}
        dateFormat="L"
        dateTimeFormat="L LT"
        meta={{}}
      />
      <DateInput
        label="To"
        input={{
          value: filter.value.to,
          onChange: value => {
            onChange({ ...filter.value, to: value });
          }
        }}
        dateFormat="L"
        dateTimeFormat="L LT"
        meta={{}}
      />
    </div>
  )
});

const getCheckboxCell = (column, cell) => ({
  ...cell,
  sortable: false,
  filterable: false,
  Cell: r => {
    console.log({ r });
    return (
      <input
        type="checkbox"
        className="checkbox"
        checked={toBoolean(r.value)}
        readOnly
      />
    );
  },
  width: 45
});

export {
  getCellBase,
  getLabelCell,
  getJsonCell,
  getPercentCell,
  getTimeagoCell,
  getCheckboxCell
};
