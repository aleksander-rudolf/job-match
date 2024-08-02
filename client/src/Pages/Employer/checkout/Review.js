import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { FormHelperText, TextField } from "@mui/material";
import { Box, Stack } from "@mui/system";
import TagsInput from "./TagsInput";

/**
 *
 * @param formData
 * @returns {JSX.Element}
 * @constructor
 */
export default function Review({ formData }) {

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
        Salary and Locations
      </Typography>
      <Stack spacing={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} >
            <TextField
              fullWidth
              id="outlined-number"
              label="Budget"
              type="budget"
              name="salary"
              InputLabelProps={{
                shrink: true,
              }}
              onBlur={(e) => handleSubmit(e.target.name, e.target.value)}
            />
            <FormHelperText>Enter your budget</FormHelperText>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="outlined-number"
              label="Working Hours"
              fullWidth
              type="hours"
              name="workingHours"
              InputLabelProps={{
                shrink: true,
              }}
              onBlur={(e) => handleSubmit(e.target.name, e.target.value)}
            />
            <FormHelperText>Enter the weekly working hours for your project </FormHelperText>
          </Grid>
        </Grid>

        <Box>
          <FormHelperText>Enter your desired locations</FormHelperText>
          <TagsInput
            tags={[]}
            formData={formData}
            name={"locations"}
          />
        </Box>
      </Stack>
    </React.Fragment>
  );
}
