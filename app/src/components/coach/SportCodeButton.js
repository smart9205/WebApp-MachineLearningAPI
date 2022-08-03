import React, { useEffect, useRef, useState } from "react";
import { Button } from '@mui/material'
import exportFromJSON from "export-from-json";

const XMLFields = [
    "SESSION_INFO"
]

const SportCodeButton = ({ game, t, team, ...rest }) => {

    const [tagsData, setTagsData] = useState({
        id: '',
        start: '',
        end: '',
        code: ''
    })

    var items = []

    const teamData = team.map(data => {

        let objData = {
            "instance": {
                "ID": data.team_tag_id,
                "start": data.t_start_time,
                "end": data.t_end_time,
                "code": data.action_name,
                "label": {
                    "text": data.action_result_name
                }
            }
        }
        items.push(objData)

    })

    const XMLData = [
        {
            "SESSION_INFO": {
                "start_time": game.date
            },
            "ALL_INSTANCES": items
        },

    ]

    console.log(items)

    const getActualDate = new Date(game.date)
    const date = getActualDate.getDate()
    const month = getActualDate.getMonth()
    const year = getActualDate.getFullYear()
    const gameDate = '(' + date + '-' + month + '-' + year + ')'

    console.log(gameDate)

    const downloadXML = () => {
        const data = XMLData;
        const fileName = game.home_team_name + ' vs ' + game.away_team_name + ' ' + gameDate;
        let fields = [];
        const exportType = 'xml';
        exportFromJSON({ data, fileName, fields, exportType })
    }
    return (
        <div {...rest}>
            <Button style={{ fontSize: '11px' }} variant="outlined" onClick={downloadXML}>{t("Export To SportCode")}</Button>
        </div>
    );
}

export default SportCodeButton;