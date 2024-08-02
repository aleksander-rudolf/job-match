import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fade,
  Backdrop,
  Typography,
  Divider,
  CircularProgress,
  LinearProgress,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import styled from "@emotion/styled";
import { JobApplicantsHeaders } from "./JobApplicantsHeaders";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useLocation } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { Document, Page, pdfjs } from "react-pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import Icon from "@mui/material/Icon";

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
 * @type {StyledComponent<PropsOf<OverridableComponent<BoxTypeMap>> & {theme?: Theme} & {readonly theme?: *}, {}, {}>}
 */
const CustomBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#18385C" : "#E6E9ED",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "700px",
  height: "90%",
  maxHeight: "1000px",
  borderRadius: 7,
}));

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function JobApplicants() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [resume, setResume] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noResume, setNoResume] = useState(false);
  const [offer, setOffer] = useState(null);

  const pdfContainerStyle = {
    maxHeight: "80vh", // Change the percentage value according to your needs
    overflowY: "auto",
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    /**
     *
     * @returns {Promise<void>}
     */
    const fetchData = async () => {
      let jobID = localStorage.getItem("jobID");
      let requestOptions = {
        url: `${process.env.REACT_APP_API_URL}/job-posts/${jobID}`,
        method: "GET",
        redirect: "follow",
      };

      /**
       *
       * @type {Response}
       */
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/job-posts/${jobID}`,
        requestOptions
      );
      if (response.status === 200) {
        const responseData = await response.json();
        setData(responseData.results);
      }
    };

    fetchData();
  }, []);

  const handleSendOffer = async ({ JSID }) => {
    console.log(JSID);

    const raw = JSON.stringify({
      HID: localStorage.getItem("userID"),
      JSID: JSID,
      JID: localStorage.getItem("jobID"),
    });
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      url: `${process.env.REACT_APP_API_URL}/offers/create`,
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/offers/create`,
      requestOptions
    );

    if (response.status === 200) {
      const result = await response.json();
      setOffer(
        "Offer Sent: An email has been sent to the applicant with the offer details."
      );
    } else {
      setOffer("Could not send offer, please try again at another time");
    }
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOffer(null);
  };

  const handleOpenModal = async ({ JSID }) => {
    try {
      setModal(true);
      const raw = JSON.stringify({
        JSID: JSID,
        JID: localStorage.getItem("jobID"),
      });
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      let requestOptions = {
        url: `${process.env.REACT_APP_API_URL}/apply/view-resume`,
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/apply/view-resume`,
        requestOptions
      );

      if (response.status === 200) {
        const blob = await response.blob();
        setResume(URL.createObjectURL(blob));
      } else {
        setLoading(false);
        setNoResume(true);
      }
    } catch (error) {
      console.error("An error occurred while fetching the resume:", error);
      setLoading(false);
      setNoResume(true);
    }
  };

  const handleCloseMModal = () => {
    setModal(false);
    setResume(null);
    setLoading(true);
    setNoResume(false);
  };

  return (
    <>
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
        <Snackbar
          open={offer}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            sx={{ mb: 3, display: offer ? "" : "none" }}
            severity="info"
          >
            {offer}
          </Alert>
        </Snackbar>
        <TableContainer component={Paper} sx={{ boxShadow: 6 }}>
          <MyTable
            sx={{ minWidth: 650 }}
            size="small"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                {JobApplicantsHeaders.map((column) => (
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
              {data.map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {JobApplicantsHeaders.map((column) => {
                      const value = row[column.accessor];
                      if (column.accessor === "sendOffer") {
                        return (
                          <TableCell key={column.accessor} align="center">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              onClick={() => {
                                handleSendOffer(data[index]);
                              }}
                              sx={{
                                transition: "0.3s",
                                "&:hover": {
                                  boxShadow: 10,
                                },
                              }}
                            >
                              <OpenInNewIcon fontSize="inherit" />
                            </IconButton>
                          </TableCell>
                        );
                      } else if (column.accessor === "url") {
                        return (
                          <TableCell key={column.accessor}>
                            <IconButton
                              aria-label="delete"
                              size="small"
                              onClick={() => handleOpenModal(data[index])}
                              sx={{
                                transition: "0.3s",
                                "&:hover": {
                                  boxShadow: 10,
                                },
                              }}
                            >
                              <PictureAsPdfIcon fontSize="inherit" />
                            </IconButton>
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
      <Modal
        open={modal}
        onClose={handleCloseMModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: "blur(4px)" }}
        disableAutoFocus
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <CustomBox
          sx={{
            p: 1.5,
            boxShadow: 19,
            overflowY: "scroll"
          }}
        >
          {noResume && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Stack direction={"column"} alignItems="center">
                <PriorityHighRoundedIcon
                  color="error"
                  sx={{ height: "65px", width: "65px" }}
                />
                <Typography>Applicant did not submit resume</Typography>
              </Stack>
            </Box>
          )}
          {loading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          )}
          {resume && (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Document
                file={resume}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={null}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    renderTextLayer={false}
                    onLoadSuccess={() => setLoading(false)}
                    loading={null}
                  >
                    <Divider />
                  </Page>
                ))}
              </Document>
            </Box>
          )}
        </CustomBox>
      </Modal>
    </>
  );
}

export default JobApplicants;
