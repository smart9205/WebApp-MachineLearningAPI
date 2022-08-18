import React, { useEffect, useRef } from 'react'
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ExcelDataFiltering = ({ team, setExcelData }) => {

    useEffect(() => {
        document.getElementById('exelDownload').click()
        setExcelData(false)
    }, [])

    return (
        <ExcelFile element={<button style={{ display: 'none' }} id='exelDownload' ></button>}>
            <ExcelSheet data={team} name="Team Tags">
                <ExcelColumn label="Date" value="game_date" />
                <ExcelColumn label="Start Time" value="start_time" />
                <ExcelColumn label="End Time" value="end_time" />
                <ExcelColumn label="Period" value="period_name" />
                <ExcelColumn label="Offensive Team" value="offensive_team_name" />
                <ExcelColumn label="Defensive Team" value="defensive_team_name" />
                <ExcelColumn label="First Name" value="player_fname" />
                <ExcelColumn label="Last Name" value="player_lname" />
                <ExcelColumn label="Action" value="action_name" />
                <ExcelColumn label="Action Type" value="action_type_name" />
                <ExcelColumn label="Action Result" value="action_result_name" />
            </ExcelSheet>
        </ExcelFile>
    )
}

export default ExcelDataFiltering