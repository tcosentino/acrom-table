import React from "react";
import moment from "moment";
import isString from "lodash/isString";
import ReactJson from "react-json-view";
import { ProgressBar } from "react-bootstrap";
import { DateInput } from "acromyrmex";
import { toBoolean } from "./DataConversion";

const getCellBase = column => ({
  Header: column.display || column.key,
  accessor: column.key,
  width: column.width || 150,
  toggleable: true
});

const cellFactory = func => {
  return r => {
    if (!r || !r.value) {
      return "";
    }

    return func(r);
  };
};

const getLabelCell = (column, cell) => ({
  ...cell,
  Cell: cellFactory(r => r.value.toString())
});

const getJsonCell = (column, cell) => ({
  ...cell,
  Cell: cellFactory(r => {
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
  })
});

const getPercentCell = (column, cell) => ({
  ...cell,
  Cell: cellFactory(r => (
    <div style={{ minWidth: "150px" }}>
      <ProgressBar
        now={r.value * 100}
        label={`${Math.floor(r.value * 100)}%`}
      />
    </div>
  ))
});

const getTimeagoCell = (column, cell) => ({
  ...cell,
  width: 225,
  Cell: cellFactory(r => {
    const momentDate = moment(r.value);
    const notToday = moment().diff(momentDate, "days") >= 1;
    const notThisYear = moment().diff(momentDate, "years") >= 1;
    let text = "";

    text += notToday
      ? momentDate.format(`MMMM D${notThisYear ? ",  YYYY" : ""} [at] h:mm A`)
      : momentDate.format("h:mm A");

    return <span>{text}</span>;
  }),
  Filter: ({
    filter = {
      id: "birthday",
      value: { from: "", to: "" }
    },
    onChange
  }) => (
    <div className="date-filter form-inline">
      <div>
        <DateInput
          label="From"
          stripped
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
      </div>
      <div>
        <DateInput
          label="To"
          stripped
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
    </div>
  )
});

const getCheckboxCell = (column, cell) => ({
  ...cell,
  sortable: false,
  filterable: false,
  Cell: cellFactory(r => {
    return (
      <input
        type="checkbox"
        className="checkbox"
        checked={toBoolean(r.value)}
        readOnly
      />
    );
  }),
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
