import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    TableCell,
    TableRow,
    TableContainer,
    Table,
    TableHead,
    TableBody
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

import { ACTION_DEMO } from '../../../common/staticData'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    // [`&.${tableCellClasses.head}`]: {
    //     backgroundColor: theme.palette.common.black,
    //     color: theme.palette.common.white,
    // },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
const DEMO = {
    Shot: {
        success: ["On Target", "Goal"],
        cols: ["On Target", "Off Target"]
    },
    Pass: {
        success: ["Successful"],
        cols: ["Successful", "Unsuccessful"]
    },
    Cross: {
        success: ["Successful"],
        cols: ["Successful", "Unsuccessful"]
    },
    Dribble: {
        success: ["Successful"],
        cols: ["Successful", "Unsuccessful"]
    },
    Foul: {
        success: ["Free Kick"],
        cols: ["Successful", "Unsuccessful"]
    }
}
export default function StatisticTab({ tagList }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        let actions = {}
        tagList.forEach(tag => {
            const actionKey = tag.action_name
            const typeKey = tag.action_type_name
            let success = actions?.[actionKey]?.[typeKey]?.success ?? []
            let unsuccess = actions?.[actionKey]?.[typeKey]?.unsuccess ?? []

            if (DEMO?.[actionKey]?.success.includes(tag.action_result_name)) {
                success = [...success, tag]
            } else {
                unsuccess = [...unsuccess, tag]
            }

            actions = {
                ...actions,
                [actionKey]: {
                    ...actions?.[actionKey],
                    [typeKey]: { success, unsuccess }
                }
            }
        })
        console.log("actions", actions)
        setData(actions)
    }, [tagList])
    return (
        <Box>
            {
                data && Object.keys(data).map((key, idx) =>
                    <Paper key={idx} sx={{ my: 1 }}>
                        <h6 style={{ textAlign: 'center' }}>{key}</h6>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell></StyledTableCell>
                                    {
                                        key === "Shot" ?
                                            <>
                                                <StyledTableCell align="center">On Target</StyledTableCell>
                                                <StyledTableCell align="center">Off Target</StyledTableCell>
                                            </>
                                            :
                                            <>
                                                <StyledTableCell align="center">Successful</StyledTableCell>
                                                <StyledTableCell align="center">Unsuccessful</StyledTableCell>
                                            </>
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(data[key]).map((type, i) =>
                                    <StyledTableRow key={i}>
                                        <StyledTableCell align="center">
                                            {type}
                                        </StyledTableCell>
                                        <StyledTableCell align="center" onClick={() => { }}>{data[key][type]?.success.length ?? 0}</StyledTableCell>
                                        <StyledTableCell align="center">{data[key][type]?.unsuccess.length ?? 0}</StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                )
            }
        </Box >
    )
}