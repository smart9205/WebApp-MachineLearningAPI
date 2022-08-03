import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from "./basic/ModalList"

const SubBox = styled(Box)`
  margin: 6px;
  & nav {
    padding: 6px;
    border-radius: 6px;
  }
  `;

const DEFENSIVE = "Defensive"
const DEFENSIVE_MIDDLE = "Defensive Middle"
const OFFENSIVE_MIDDLE = "Offensive Middle"
const OFFENSIVE = "Offensive"


export default function AreaCourtMenu({
    areaCourtId, setAreaCourtId, inTheBox, setInTheBox,
}) {

    return (
        <>
            <SubBox>
                <List header="Area">
                    {[
                        { id: 1, name: OFFENSIVE },
                        { id: 2, name: OFFENSIVE_MIDDLE },
                        { id: 3, name: DEFENSIVE_MIDDLE },
                        { id: 4, name: DEFENSIVE },
                    ].map((r, i) => (
                        <ListItemButton key={r.id}
                            selected={areaCourtId === r.id}
                            onClick={() => {
                                setAreaCourtId(r.id)
                            }}
                        >
                            <ListItemText primary={r.name} />
                        </ListItemButton>
                    ))
                    }
                </List>
            </SubBox>

            {
                areaCourtId && (areaCourtId === 1 || areaCourtId === 4) &&
                <SubBox>
                    <List header="In The Box">
                        {
                            ["Yes", "No"].map((g, i) => (
                                <ListItemButton key={i}
                                    selected={inTheBox === g}
                                    onClick={() => {
                                        setInTheBox(g)
                                    }}
                                >
                                    <ListItemText primary={g} />
                                </ListItemButton>
                            ))
                        }
                    </List>
                </SubBox>
            }
        </>
    );
} 