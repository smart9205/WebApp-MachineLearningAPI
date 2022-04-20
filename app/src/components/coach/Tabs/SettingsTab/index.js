import React from 'react'
import Box from "@mui/material/Box";

const SettingsTab = ({frameSrc}) => {
  return (
    <Box sx={{ width: "100%", minHeight: "80vh" }}>
      <iframe src={frameSrc} style={{height: '100%', width: '100%'}} />
    </Box>
  )
}

export default SettingsTab