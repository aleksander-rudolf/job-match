import React from 'react';
import Typography from '@mui/material/Typography';
import TagsInput from './TagsInput';
import { Box } from '@mui/system';

/**
 *
 * @param formData
 * @returns {JSX.Element}
 * @constructor
 */
export default function PaymentForm({formData}) {
  return (
    <React.Fragment>
      <Typography variant="h4" mb={4}>
        Skills
      </Typography>
      <Box>
        <TagsInput tags={[]} formData={formData} name={"skills"}/>
      </Box>
    </React.Fragment>
  );
}
