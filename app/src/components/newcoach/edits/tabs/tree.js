import { Box } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const Tree = ({ editList }) => {

    const [items, setItems] = useState(editList)

    useEffect(() => {
        setItems(editList)
        console.log(editList)
    }, [editList])

    return (
        <Box>
            <ul>
                {items && items.map(tree => (
                    <TreeNode node={tree} />
                ))}

            </ul>
        </Box>
    )
}

const TreeNode = ({ node }) => {
    const [childVisiblity, setChildVisibility] = useState(false)

    const hasChild = node.children ? true : false

    return (
        <li>
            <Box onClick={e => setChildVisibility(v => !v)}>
                {hasChild && (
                    <Box>
                        <h5>--</h5>
                    </Box>
                )}

                <Box>
                    <p style={{ color: 'black' }}>
                        {node.name}
                    </p>
                </Box>
            </Box>

            {hasChild && childVisiblity &&

                <Box>
                    <ul>
                        <Tree editList={node.chilldren} />
                    </ul>
                </Box>

            }

        </li>
    )
}

export default Tree