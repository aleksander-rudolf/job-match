import {
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import styled from "@emotion/styled";
import { OffersHeaders } from "./OffersHeaders";

/**
 *
 * @type {StyledComponent<PropsOf<OverridableComponent<TableTypeMap>> & {theme?: Theme} & {readonly theme?: *}, {}, {}>}
 */
const MyTable = styled(Table)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#18385C" : "white",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

/**
 *
 * @type {StyledComponent<PropsOf<(props: TableCellProps) => JSX.Element> & {theme?: Theme} & {readonly theme?: *}, {}, {}>}
 */
const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#0d294a" : "white",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  fontWeight: "bold"
}));

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function Offers({addNavbarHeader}) {
  const [data, setData] = useState([]);

  const handleSelectChange = async (value, index) => {
    const userID = localStorage.getItem("userID");
    console.log(`${value} for ${index}. ID is ${data[index].HID}`);
    let newData = [...data];
    newData[index].clientstatus = value;
    setData(newData);
    const formInput = {
      HID : userID,
      STATUS : value,
      JSID : data[index].JSID
    }
    const raw = JSON.stringify(formInput);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      url: `${process.env.REACT_APP_API_URL}/offers/update-status-hiring-manager`,
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(
      `${process.env.REACT_APP_API_URL}/offers/update-status-hiring-manager`,
      requestOptions
    );

  };

  useEffect(() => {

    addNavbarHeader("Offers")
    const fetchData = async () => {
      const userID = localStorage.getItem('userID');

      let requestOptions = {
        url: `${process.env.REACT_APP_API_URL}/offers/hiringManager/${userID}`,
        method: 'GET',
        redirect: 'follow'
      }
      const response = await fetch(`${process.env.REACT_APP_API_URL}/offers/hiringManager/${userID}`, requestOptions);
      if (response.status === 200) {
        const responseData = await response.json() 
        setData(responseData.results)
        console.log(responseData.results)
      }
  }

  fetchData()
  }, []);

  return (
    <Box
      sx={{
        p: "40px",
        height: "calc(100vh - 64px)",
        maxHeight: "calc(100vh - 64px)",
        overflowY: "scroll",
      }}
      justifyContent="center"
      alignItems={"center"}
      spacing={0}
    >
      <TableContainer component={Paper} sx={{ boxShadow: 6 }}>
        <MyTable sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {OffersHeaders.map((column) => (
                <HeaderTableCell
                  key={column.accessor}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.HEADER}
                </HeaderTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.code}
                  sx={{
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: 1,
                    },
                  }}
                >
                  {OffersHeaders.map((column) => {
                    const value = row[column.accessor];
                    if (column.accessor === "clientstatus") {
                      return (
                        <TableCell key={column.accessor} align="center">
                          <FormControl
                            sx={{ m: 0.5, minWidth: 100,maxWidth: 100 }}
                            size="small"
                          >
                            <Select
                              labelId="freelancer-status"
                              id="freelancer-status"
                              value={value}
                              onChange={(event) => {
                                handleSelectChange(event.target.value, index)
                              }}
                              autoWidth
                            >
                              <MenuItem value={"rejected"}>
                                <Typography variant="body2">
                                  rejected
                                </Typography>
                              </MenuItem>

                              <MenuItem value={"agreed"}>
                                <Typography variant="body2">
                                  agreed
                                </Typography>
                              </MenuItem>

                              <MenuItem value={"pending"}>
                                <Typography variant="body2">
                                  pending
                                </Typography>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell key={column.accessor} align="center">
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </MyTable>
      </TableContainer>
    </Box>
  );
}

export default Offers;
