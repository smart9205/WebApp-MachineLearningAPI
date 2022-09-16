import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { TableCell, TableRow, Checkbox } from '@mui/material';

export const EditDraggableTableRow = ({ id, row, index, moveRow, selected, isTeam, rowChecked, onCheck, ...rest }) => {
    const ref = useRef(null);
    const [{ handlerId }, drop] = useDrop({
        accept: 'TeamTagRow',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId()
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
        }
    });
    const [{ isDragging }, drag] = useDrag({
        type: 'TeamTagRow',
        item: () => {
            return { id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    drag(drop(ref));

    const getPeriod = (period) => {
        return period === 1 ? '1st Half' : period === 2 ? '2nd Half' : 'Overtime';
    };

    return (
        <TableRow hover ref={ref} data-handler-id={handlerId} tabIndex={-1} role="checkbox" selected={selected} {...rest}>
            <TableCell>
                <Checkbox checked={rowChecked} onChange={() => onCheck(id)} />
            </TableCell>
            <TableCell align="center" style={{ height: '36px' }}>
                {isTeam ? getPeriod(row.period) : row.action_name}
            </TableCell>
            <TableCell align="center" style={{ height: '36px' }}>
                {isTeam ? row.offensive_team_name : row.action_type_name}
            </TableCell>
            <TableCell align="center" style={{ height: '36px' }}>
                {isTeam ? row.defensive_team_name : row.action_result_name}
            </TableCell>
            {!isTeam && (
                <TableCell align="center" style={{ height: '36px' }}>
                    {`${row.player_fname} ${row.player_lname}`}
                </TableCell>
            )}
            <TableCell align="center" style={{ height: '36px' }}>
                {row.start_time}
            </TableCell>
            <TableCell align="center" style={{ height: '36px' }}>
                {row.end_time}
            </TableCell>
        </TableRow>
    );
};