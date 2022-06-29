import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TCellTimeEdit from '../../../tagging/TCellTimeEdit';
import GameService from '../../../../services/game.service';
import { Checkbox } from '@mui/material';

export const TeamTagRow = ({ id, row, index, moveRow, onPlay, selected, handleRowSelection, checked, ...rest }) => {
    const ref = useRef(null);
    const [loading, setLoading] = useState(false)

    const [{ handlerId }, drop] = useDrop({
        accept: "TeamTagRow",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            moveRow(dragIndex, hoverIndex);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });
    const [{ isDragging }, drag] = useDrag({
        type: "TeamTagRow",
        item: () => {
            return { id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    const update = (data) => {
        setLoading(true)
        GameService.updateEditClip(data).then(res => {
            setLoading(false)
        }).catch(err => setLoading(false))
    }

    return (
        <TableRow
            hover
            ref={ref}
            data-handler-id={handlerId}
            role="checkbox"
            tabIndex={-1}
            selected={selected}
            {...rest}
        >
            <TableCell>
                <Checkbox
                    checked={checked}
                    onChange={() => handleRowSelection(id)}
                />
            </TableCell>
            <TableCell align="center">{row.period_name}</TableCell>
            <TableCell align="center">{row.offensive_team_name}</TableCell>
            <TableCell align="center">{row.defensive_team_name}</TableCell>
            <TCellTimeEdit
                value={row.start_time}
                update={v => {
                    update({ ...row, start_time: v })
                    row.start_time = v
                }}
                end={row.end_time}
            />
            <TCellTimeEdit
                value={row.end_time}
                update={v => {
                    update({ ...row, end_time: v })
                    row.end_time = v
                }}
                start={row.start_time}
            />
            <TableCell align="center" sx={{ p: 0, m: 0 }}>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onPlay() }}>
                    <PlayCircleIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};
