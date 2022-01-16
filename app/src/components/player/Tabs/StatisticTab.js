import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    TableCell,
    TableRow,
    Table,
    TableHead,
    TableBody
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { divideTags } from '../../../common/utilities';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        // backgroundColor: theme.palette.common.black,
        // color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        width: "33%",
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

export default function StatisticTab({ tagList, playTags }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        const actions = divideTags(tagList)
        setData(actions)
    }, [tagList])
    return (
        <Box>
            {data && Object.keys(data).map((key, idx) =>
                <Paper key={idx} sx={{ my: 1 }}>
                    <h6 style={{ textAlign: 'center' }}>{key}</h6>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell></StyledTableCell>
                                {key === "Shot" ?
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
                            {Object.keys(data[key]).map((type, i) => {
                                const success = data[key][type]?.success
                                const unsuccess = data[key][type]?.unsuccess
                                return (
                                    <StyledTableRow key={i}>
                                        <StyledTableCell align="center">
                                            {type}
                                        </StyledTableCell>
                                        <StyledTableCell align="center" onClick={() => { !!success.length && playTags(success) }}>{success.length}</StyledTableCell>
                                        <StyledTableCell align="center" onClick={() => { !!unsuccess.length && playTags(unsuccess) }}>{unsuccess.length}</StyledTableCell>
                                    </StyledTableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            )
            }
        </Box >
    )
}