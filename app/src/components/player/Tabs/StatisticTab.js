import React, { useEffect } from 'react';
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

import { actions } from '../../../common/staticData'

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

export default function StatisticTab({ tagList }) {

    useEffect(() => {
        let statisticData = []
        // tagList.map(tag => {
        //     actions[tag.action_name]
        // })
    }, [tagList])
    return (
        <Box>
            {
                Object.keys(actions).map((key, idx) =>
                    <Paper key={idx} sx={{ my: 1 }}>
                        <h6 style={{ textAlign: 'center' }}>{key}</h6>
                        <TableContainer component={Paper}>
                            <Table aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell></StyledTableCell>
                                        {
                                            actions[key].calc.map((result, i) => (
                                                <StyledTableCell align="center" key={i}>{result.title}</StyledTableCell>
                                            ))
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {actions[key].type.map((type) =>
                                        <StyledTableRow key={type.id}>
                                            <StyledTableCell align="center">
                                                {type.name}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">0</StyledTableCell>
                                            <StyledTableCell align="center">0</StyledTableCell>
                                        </StyledTableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Paper>
                )
            }
        </Box >
    )
}