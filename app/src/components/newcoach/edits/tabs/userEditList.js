import React, { useEffect, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';
import DroppableSubItems from './DroppableSubItems'

import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem'
import VideoList from './videoList'

const UserEditList = ({
    editList, tagList, userEditsFolders, curEdit, videoData,
    onChangeClip,
    handleUserEditDetail,
    setEditOpen,
    setEditName,
    setDeleteOpen, }) => {

    const [items, setItems] = useState(editList)

    const handleOnDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const newItems = [...items];
        const [removed] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, removed);
        setItems(newItems)
    }

    useEffect(() => {
        setItems(editList)
    }, [tagList, editList])

    return (

        <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ height: '100%', flexGrow: 1, maxWidth: 400, overflowY: 'auto', color: 'black' }}
        >
            {items && items.map((data, idx) => (
                <TreeItem nodeId={String(idx)} label={data.name} key={idx} onClick={() => handleUserEditDetail(data)}>
                    <>
                        <VideoList tagList={userEditsFolders} videoData={videoData} onChangeClip={onChangeClip} />
                    </>
                </TreeItem>
            ))
            }
        </TreeView >

        // <DragDropContext onDragEnd={handleOnDragEnd}>
        //     <Droppable droppableId="droppable" type="droppableItem">
        //         {(provided, snapshot) => (
        //             <div
        //                 {...provided.droppableProps}
        //                 ref={provided.innerRef}
        //             >
        //                 {items && items.map((item, index) => (
        //                     <Draggable draggableId={String(index)} index={index} key={index}>
        //                         {(provided, snapshot) => (
        //                             <div
        //                                 ref={provided.innerRef}
        //                                 {...provided.draggableProps}
        //                                 {...provided.dragHandleProps}
        //                             >
        //                                 <p style={{ color: 'black' }} onClick={() => handleUserEditDetail(item)} >{item.name}</p>
        //                                 <DroppableSubItems userEditsFolders={userEditsFolders} />
        //                             </div>
        //                         )}
        //                     </Draggable>
        //                 ))}
        //                 {provided.placeholder}
        //             </div>

        //         )}
        //     </Droppable>
        // </DragDropContext>
    )
}

export default UserEditList