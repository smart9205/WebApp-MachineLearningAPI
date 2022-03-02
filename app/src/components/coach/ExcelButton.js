import React, { useRef } from "react";
import ReactExport from "react-export-excel";
import { Button } from '@mui/material'

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ExcelButton = ({ team, ...rest }) => {

	console.log("export data", team)
	const buttonRef = useRef();

	const downloadExcel = () => {
		buttonRef.current.click();
	}

	return (
		<div {...rest}>
			<Button variant="outlined" onClick={downloadExcel}>{'Export'}</Button>
			<ExcelFile element={<button style={{ display: 'none' }} ref={buttonRef}></button>}>
				<ExcelSheet data={team} name="Team Tags">
					<ExcelColumn label="Start Time" value="t_start_time" />
					<ExcelColumn label="End Time" value="t_end_time" />
					<ExcelColumn label="Offensive Team" value="offensive_team_name" />
					<ExcelColumn label="Defensive Team" value="defensive_team_name" />
					<ExcelColumn label="First Name" value="player_fname" />
					<ExcelColumn label="Last Name" value="player_lname" />
					<ExcelColumn label="Action" value="action_name" />
					<ExcelColumn label="Action Type" value="action_type_name" />
					<ExcelColumn label="Action Result" value="action_result_name" />
				</ExcelSheet>
			</ExcelFile>
		</div>
	);
}

export default ExcelButton;