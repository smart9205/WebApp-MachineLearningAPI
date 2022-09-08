import React, { useEffect, useState, ReactElement } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { TreeView, TreeItem, treeItemClasses } from '@mui/lab';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '../../../assets/Folder.svg';
import EditsIcon from '../../../assets/Edits.svg';

import GameService from '../../../services/game.service';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;

    if (b[orderBy] > a[orderBy]) return 1;

    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);

        if (order !== 0) return order;

        return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
}

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: 'var(--bs-dark)',
    [`& .${treeItemClasses.content}`]: {
        color: 'var(--bs-dark)',
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--bs-dark)'
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit'
        }
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2)
        }
    }
}));

function StyledTreeItem(props) {
    const { bgColor, color, labelIcon: LabelIcon, labelInfo, labelText, ...other } = props;

    return (
        <StyledTreeItemRoot
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
                    <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                </Box>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor
            }}
            {...other}
        />
    );
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired
};

const Edits = () => {
    const [values, setValues] = useState({
        loading: false
    });
    const [folders, setFolders] = useState([]);

    const getChilds = (folders, parent_id) => {
        const children = folders.filter((item) => item.parent_id === parent_id);
        let trees = [];

        if (children.length > 0) {
            children.map((item) => {
                const childs = getChilds(folders, item.id);
                let tree = { id: String(item.id), name: item.name };

                if (childs.length > 0) tree = { id: String(item.id), name: item.name, children: childs };

                trees = [...trees, tree];

                return trees;
            });
        }

        return trees;
    };

    const getTreeViewData = (res) => {
        const parents = res.filter((item) => item.parent_id === null);
        const other = res.filter((item) => item.parent_id !== null);
        let trees = [];

        if (parents.length > 0) {
            parents.map((item) => {
                const child = getChilds(other, item.id);
                let tree = { id: String(item.id), name: item.name };

                if (child.length > 0) tree = { id: String(item.id), name: item.name, children: child };

                trees = [...trees, tree];

                return trees;
            });
        } else {
            let childs = [];
            let node = {};

            other.map((item) => {
                const tree = { id: String(item.id), name: item.name };

                childs = [...childs, tree];

                return childs;
            });
            node = { id: 0, name: 'root', children: childs };

            return node;
        }

        return trees;
    };

    const renderTree = (nodes) => (
        <TreeItem
            key={nodes.id}
            nodeId={nodes.id}
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', padding: '2px 0', gap: '4px' }}>
                    {Array.isArray(nodes.children) ? <img src={FolderIcon} style={{ height: '24px' }} /> : <img src={EditsIcon} style={{ height: '24px' }} />}
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d', flexGrow: 1 }}>{nodes.name}</Typography>
                </Box>
            }
        >
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeItem>
    );

    useEffect(() => {
        setValues({ ...values, loading: true });
        GameService.getAllFolders().then((res) => {
            const ascArray = stableSort(res, getComparator('asc', 'id'));

            setFolders(getTreeViewData(ascArray));
            setValues({ ...values, loading: false });
        });
    }, []);

    console.log('Edits => ', folders);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            {values.loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            <Box sx={{ width: '100%', padding: '24px 24px 21px 48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>My Edits</Typography>
            </Box>
            <Box sx={{ display: 'flex', height: '80vh', background: 'white', padding: '24px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E8E8E8', height: '100%', width: '300px', padding: '16px 8px' }}>
                    <TreeView
                        aria-label="rich object"
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpanded={['root']}
                        defaultExpandIcon={<ChevronRightIcon />}
                        defaultEndIcon={<div style={{ width: 24 }} />}
                        sx={{ height: '100%', flexGrow: 1, width: '100%', overflowY: 'auto', color: '#1a1b1d' }}
                    >
                        {folders.length > 0 && folders.map((data) => renderTree(data))}
                    </TreeView>
                </Box>
            </Box>
        </Box>
    );
};

export default Edits;
