import React, { useRef, useState } from "react";
import ReactExport from "react-export-excel";
import { Button } from '@mui/material'
import ExcelDataFiltering from "./ExcelDataFiltering";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ExcelButton = ({ team, t, ...rest }) => {

	const [excelData, setExcelData] = useState(false)

	return (
		<div {...rest}>
			<Button style={{ fontSize: '11px' }} variant="outlined" onClick={() => {
				setExcelData(true)
			}}>{t("Export To Excel")}</Button>
			{excelData &&
				<ExcelDataFiltering team={team} setExcelData={setExcelData} />
			}
		</div>
	);
}

export default ExcelButton;