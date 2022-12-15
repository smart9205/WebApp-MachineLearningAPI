import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box } from '@mui/material';
import React, { useState } from 'react';

import GameService from '../../../../../services/game.service';
import EditFolderTreeView from '../../../edits/treeview';

const GameExportToEdits = ({ open, onClose, tagList, isTeams, t }) => {
    const [curEdit, setCurEdit] = useState(null);

    const getPeriod = (id) => {
        return id === 1 ? 'H1' : id === 2 ? 'H2' : 'OT';
    };

    const getName = (item) => {
        return `${getPeriod(item.period)} - ${item.time_in_game} - ${item.player_names} - ${item.action_names} - ${item.action_type_names} - ${item.action_result_names}`;
    };

    const handleSave = async () => {
        if (curEdit.type === 'edit') {
            let bigSort = 0;

            await GameService.getBiggestSortNumber('Clip', curEdit.id ?? 0).then((res) => {
                bigSort = res['biggest_order_num'] === null ? 0 : res['biggest_order_num'];
            });

            const newList = tagList.map((item, index) => {
                return {
                    start_time: isTeams ? item.team_tag_start_time : item.player_tag_start_time,
                    end_time: isTeams ? item.team_tag_end_time : item.player_tag_end_time,
                    edit_id: curEdit.id,
                    sort: bigSort + index + 1,
                    game_id: item.game_id,
                    name: getName(item)
                };
            });
            await GameService.addNewEditClips({ id: curEdit.id, rows: newList });
            onClose();
        } else window.alert('You selected folder. Please select edit to save clips.');
    };

    return (
        <Dialog open={open} onClose={onClose} scroll="paper" maxWidth="lg">
            <DialogTitle>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>Export to My Edits</Typography>
            </DialogTitle>
            <DialogContent dividers={true} style={{ display: 'flex', overflowY: 'hidden' }}>
                <EditFolderTreeView t={t} setEdit={setCurEdit} isMain={false} entireHeight="390px" treeHeight="85%" />
                <Box sx={{ overflowY: 'auto', maxHeight: '390px', width: '600px', paddingLeft: '16px' }}>
                    <Box sx={{ margin: '0 4px 8px 0', width: 'calc(100% - 4px)' }}>
                        {tagList.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    gap: '8px',
                                    padding: '4px',
                                    border: '1px solid #e8e8e8',
                                    borderRadius: '8px'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Box sx={{ background: '#C5EAC6', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: 'white' }}>{index + 1}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>
                                            {isTeams ? `${getPeriod(item.period)} - ${item.time_in_game}' - ${item.player_names}` : getName(item)}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>
                                                {`${item.home_team_name} VS ${item.away_team_name}`}
                                            </Typography>
                                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#1a1b1d' }}>{item.game_date}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '4px', width: '80px' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{item.player_tag_start_time}</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{item.player_tag_end_time}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button variant="outlined" onClick={() => handleSave()}>
                    Export
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GameExportToEdits;
