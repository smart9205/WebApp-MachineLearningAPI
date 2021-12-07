import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import VideoPlayer from './videoplayer';
import Playground from './playground';

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

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
