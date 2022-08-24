import { Box } from '@mui/material'
import React from 'react'
import { useState } from 'react'

const Tree = ({ items }) => {
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
                    {node.name}
                </Box>
            </Box>

            {hasChild && childVisiblity &&

                <Box>
                    <ul>

                    </ul>
                </Box>

            }

        </li>
    )
}

export default Tree