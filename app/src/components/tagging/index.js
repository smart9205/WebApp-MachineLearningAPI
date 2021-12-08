import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import VideoPlayer from './videoplayer';
import Playground from './playground';

export default function Tagging() {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={4}>
					<Playground />
				</Grid>
				<Grid item xs={12} sm={8}>
					<VideoPlayer />
				</Grid>
			</Grid>
		</Box>
	);
}
