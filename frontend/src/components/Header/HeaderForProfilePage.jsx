import React, { useState } from "react";

export default function HeaderForProfilePage(props) {
  return (
    <div>
      <table className="width-100">
        <tbody>
          <tr>
            <td className="table_data">
              <button
                type="button"
                className="btn btn-default"
                onClick={props.invertProfilePage}
              >
                Home
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}