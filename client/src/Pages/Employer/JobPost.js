import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import styled from "@emotion/styled";
import { JobPostsHeaders } from "./JobPostsHeaders";
import { useHistory } from "react-router-dom";
import GroupAddIcon from "@mui/icons-material/GroupAdd";


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
  fontWeight: "bold",
}));

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function JobPosts({addNavbarHeader}) {
  const [data, setData] = useState([]);
  const history = useHistory();

  useEffect(() => {
    addNavbarHeader("My Job Posts");


    /**
     *
     * @returns {Promise<void>}
     */
    const fetchData = async () => {
      const userID = localStorage.getItem("userID");

      let requestOptions = {
        url: `${process.env.REACT_APP_API_URL}/job-posts/hiringManager/${userID}`,
        method: "GET",
        redirect: "follow",
      };
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/job-posts/hiringManager/${userID}`,
        requestOptions
      );
      if (response.status === 200) {
        const responseData = await response.json();
        setData(responseData.results);
      }
    };

    fetchData();
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
              {JobPostsHeaders.map((column) => (
                <HeaderTableCell
                  sx={{ fontWeight: "bold" }}
                  key={column.accessor}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.HEADER}
                </HeaderTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
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
                  {JobPostsHeaders.map((column) => {
                    const value = row[column.accessor];
                    if (column.accessor === "applicants") {
                      return (
                        <TableCell key={column.accessor}>
                          <Tooltip
                            title="view applicants"
                            enterDelay={50}
                            enterNextDelay={50}
                          >
                            <IconButton
                              onClick={() => {
                                localStorage.setItem("jobID", row.ID );
                                history.push({
                                  pathname: `/job-posts/${row.ID}`,
                                });
                              }}
                              aria-label="delete"
                              size="medium"
                              sx={{
                                transition: "0.3s",
                                "&:hover": {
                                  boxShadow: 10,
                                },
                              }}
                            >
                              <GroupAddIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      );
                    } else if (column.accessor === "Salary") {
                      return (
                        <TableCell
                          key={column.accessor}
                          align={
                            column.accessor === "Description"
                              ? "left"
                              : "center"
                          }
                          sx={
                            column.accessor === "DatePosted"
                              ? { width: "10%" }
                              : null
                          }
                        >
                          {column.format && typeof value === "number"
                            ? `$${column.format(value)}`
                            : `$${value}`}
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell
                          key={column.accessor}
                          align={
                            column.accessor === "Description"
                              ? "left"
                              : "center"
                          }
                          sx={
                            column.accessor === "DatePosted"
                              ? { width: "10%" }
                              : null
                          }
                        >
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

export default JobPosts;
