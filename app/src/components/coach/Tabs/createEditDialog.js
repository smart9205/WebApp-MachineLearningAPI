import React, { useState, useReducer, useEffect } from "react";

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material'

import gameService from "../../../services/game.service";

const CreateEditDialog = ({ open, handleOpen }) => {
    const [curSelect, setCurSelect] = useState(0)
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        actionList: [],
        actionTypeList: [],
        actionResultList: [],

        action: 0,
        actionType: 0,
        actionResult: 0
    })
    const { actionList, actionTypeList, actionResultList, action, actionType, actionResult } = state

    useEffect(() => {
        gameService.getAllActions().then(res => setState({ actionList: res, action: res[0] }))
        gameService.getAllActionTypes().then(res => setState({ actionTypeList: res, actionType: res[0] }))
        gameService.getAllActionResults().then(res => setState({ actionResultList: res, actionResult: res[0] }))
    }, [])

    const handleChangeAction = (e) => {
        setState({ action: e.target.value })
    }

    const handleChangeActionType = (e) => {
        setState({ actionType: e.target.value })
    }

    const handleChangeActionResult = (e) => {
        setState({ actionResult: e.target.value })
    }

    const handleSearch = () => {
        console.log("handle search")
    }

    return (
        <Dialog
            fullWidth
            maxWidth={"md"}
            open={open}
            onClose={() => handleOpen(false)}
        >
            <DialogTitle>Create Edits</DialogTitle>
            <DialogContent>
                <Box style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
                    {["Defense", "Offense", "Individual"].map((label, idx) =>
                        <Button
                            key={idx}
                            variant={idx === curSelect ? "contained" : "outlined"}
                            onClick={() => setCurSelect(idx)}
                            sx={{ m: 1 }}
                        >
                            {label}
                        </Button>
                    )}
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="action-select-label">Action</InputLabel>
                        <Select
                            labelId="action-select-label"
                            id="action-select"
                            value={action}
                            label="Action"
                            fullWidth
                            onChange={handleChangeAction}
                        >
                            {actionList.map((action, idx) =>
                                <MenuItem key={idx} value={action}>{action?.name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="action-select-label">Action Types</InputLabel>

                        <Select
                            labelId="action-select-label"
                            id="action-select"
                            value={actionType}
                            label="Action Type"
                            fullWidth
                            onChange={handleChangeActionType}
                        >
                            {actionTypeList.map((actionType, idx) =>
                                <MenuItem key={idx} value={actionType}>{actionType?.name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="action-select-label">Action Results</InputLabel>
                        <Select
                            labelId="action-result-select-label"
                            id="action-result-select"
                            value={actionResult}
                            label="Action Result"
                            fullWidth
                            onChange={handleChangeActionResult}
                        >
                            {actionResultList.map((actionResult, idx) =>
                                <MenuItem key={idx} value={actionResult}>{actionResult?.name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleOpen(false)}>Close</Button>
                <Button onClick={() => handleSearch()}>Search</Button>
            </DialogActions>
        </Dialog >

    );
}

export default CreateEditDialog;