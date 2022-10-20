import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { TableCell, TableRow, Checkbox, IconButton } from '@mui/material';

import PlayIcon from '@mui/icons-material/PlayArrowOutlined';

import TCellNameEdit from './cellEditName';
import TCellTimeEdit from './cellEditTime';

export const EditDraggableTableRow = ({ id, row, index, moveRow, selected, isTeam, rowChecked, onCheck, updateList, onSelect, showPlay, setItem, onPlay, ...rest }) => {
    const ref = useRef(null);
    const [{ handlerId }, drop] = useDrop({
        accept: 'EditDraggableTableRow',
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
            moveRow(dragIndex, hoverIndex, false);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
        drop(item, monitor) {
            moveRow(0, 0, true);
        }
    });
    const [{ isDragging }, drag] = useDrag({
        type: 'EditDraggableTableRow',
        item: () => {
            return { id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    drag(drop(ref));

    return (
        <TableRow hover ref={ref} data-handler-id={handlerId} tabIndex={-1} role="checkbox" selected={selected} {...rest}>
            <TableCell>
                <Checkbox checked={rowChecked} onChange={() => onCheck(id)} />
            </TableCell>
            <TCellNameEdit
                value={row.clip_name}
                update={(v) => {
                    updateList(index, { ...row, clip_name: v }, { ...row, name: v });
                    row.name = v;
                }}
                style={{ height: '36px' }}
                onClick={() => onSelect(index)}
            />
            <TCellTimeEdit
                value={row.start_time}
                update={(v) => {
                    updateList(index, { ...row, start_time: v });
                    row.start_time = v;
                }}
                end={row.end_time}
                style={{ height: '36px' }}
                onClick={() => onSelect(index)}
            />
            <TCellTimeEdit
                value={row.end_time}
                update={(v) => {
                    updateList(index, { ...row, end_time: v });
                    row.end_time = v;
                }}
                start={row.start_time}
                style={{ height: '36px' }}
                onClick={() => onSelect(index)}
            />
            {showPlay && (
                <TableCell>
                    <IconButton
                        size="small"
                        onClick={() => {
                            setItem(row);
                            onPlay(true);
                        }}
                    >
                        <PlayIcon />
                    </IconButton>
                </TableCell>
            )}
        </TableRow>
    );
};
