import React from "react";
import { Button } from '@mui/material'
import { toXML } from 'jstoxml'

const SportCodeButton = ({ game, t, team, ...rest }) => {


    const teamData = team.map(data => ({

        instance: {
            ID: data.team_tag_id,
            start: data.t_start_time,
            end: data.t_end_time,
            code: data.action_name,
            label: {
                text: data.action_result_name
            }
        }

    }))

    console.log('Team: ', team)
    console.log('Team Data: ', teamData)

    const XMLData =
    {
        "file": {
            "SESSION_INFO": {
                "start_time": game.date
            },
            "ALL_INSTANCES": teamData
        }
    }

    const config = {
        indent: '    '
    };

    const newXMLData = toXML(XMLData, config)

    const blob = new Blob([newXMLData], { type: 'text/xml' })

    const getActualDate = new Date(game.date)
    const date = getActualDate.getDate()
    const month = getActualDate.getMonth()
    const year = getActualDate.getFullYear()
    const gameDate = '(' + date + '-' + month + '-' + year + ')'

    const downloadXML = () => {
        const fileName = game.home_team_name + ' vs ' + game.away_team_name + ' ' + gameDate;
        var pom = document.createElement('a');
        pom.setAttribute('href', window.URL.createObjectURL(blob));
        pom.setAttribute('download', fileName);
        pom.dataset.downloadurl = ['text/xml', pom.download, pom.href].join(':');
        pom.draggable = true;
        pom.classList.add('dragout');
        pom.click();
    }
    return (
        <div {...rest}>
            <Button style={{ fontSize: '11px' }} variant="outlined" onClick={downloadXML}>{t("Export To SportCode")}</Button>
        </div>
    );
}

export default SportCodeButton;