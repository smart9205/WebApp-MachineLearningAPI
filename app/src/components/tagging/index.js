import * as React from 'react';
import { useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import VideoPlayer from './videoplayer';
import Playground from './playground';
import CryptoJS from 'crypto-js'
import { SECRET } from "../../config/settings"
import GameService from '../../services/game.service';

export default function Tagging() {
	const { id } = useParams();

	const [url, setUrl] = React.useState("");

	React.useEffect(() => {
		const game_id = CryptoJS.AES.decrypt(id, SECRET).toString(CryptoJS.enc.Utf8)
		console.log("Game id", game_id)
		GameService.getGame(game_id).then((res) => {
			console.log("game Data", res);
			setUrl(res.video_url);
		})

	}, [id])

	return (
		<Box sx={{ flexGrow: 1 }}>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={4}>
					<Playground />
				</Grid>
				<Grid item xs={12} sm={8}>
					<VideoPlayer url={url}/>
				</Grid>
			</Grid>
		</Box>
	);
}
