import * as React from 'react';
import {
  CardMedia,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import COURT from "../../assets/court.png";

const FiCardMedia = styled(CardMedia)`
  root: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: "100%"
  }
  `;

export default function Players() {

  return (
    <Box>
      <FiCardMedia
        media="picture"
        alt="Court"
        image={COURT}
        title="COURT"
      />
    </Box>
  );
}
