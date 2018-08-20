import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';


class Table extends Component {
  
  
  render() {
      return (
        <div>
          <BootstrapTable data={this.props.data}>
            <TableHeaderColumn isKey dataField='cartonID'>
              Carton ID
            </TableHeaderColumn>
            <TableHeaderColumn dataField='vehicleID'>
              Vehicle ID (License Plate)
            </TableHeaderColumn>
            <TableHeaderColumn dataField='driverID'>
              Driver Name/ID
            </TableHeaderColumn>
          </BootstrapTable>
        </div>
      );
    }
  }
   
  export default Table;