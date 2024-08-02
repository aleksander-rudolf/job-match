import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  FormControl,
  FormHelperText,
} from "@mui/material";


/**
 *
 * @param formData
 * @returns {JSX.Element}
 * @constructor
 */
export default function AddressForm({ formData }) {

  /**
   *
   * @param id
   * @param value
   */
  const handleSubmit = (id, value) => {
    formData[id] = value;
  };

  return (
    <React.Fragment>
      <Typography variant="h4" mb={4}>
        Headline
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="jobName"
            name="jobName"
            label="Add a title"
            fullWidth
            autoComplete="given-name"
            onBlur={(e) => handleSubmit(e.target.name, e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl sx={{ minWidth: 120, width: "100%" }}>
            <TextField
              id="outlined-number"
              label="Duration"
              fullWidth
              type="hours"
              name="duration"
              InputLabelProps={{
                shrink: true,
              }}
              onBlur={(e) => handleSubmit(e.target.name, e.target.value)}
            />
            <FormHelperText>{"What is the length of the work term (in months)?"}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" p={1}>
            Describe Your Job
          </Typography>
          <TextField
          defaultValue={formData.description}
            required
            id="description"
            name="description"
            label="Descriptoin"
            fullWidth
            multiline
            minRows={5}
            onBlur={(e) => handleSubmit(e.target.name, e.target.value)}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
