import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table, } from 'react-bootstrap'
import { RULE } from '../../common/staticData';

export default function TeamAccordion({ playTags, allTagList = [], opponentTagList = [], onActionSelected, teamId, ...params }) {
  const [expand, setExpand] = useState(0)

  const [tagList, setTagList] = useState([])
  const [teamShots, setTeamShots] = useState([])
  const [opponentShots, setOpponentShots] = useState([])

  useEffect(() => {
    const newlist = [...allTagList, opponentTagList]
    setTagList(newlist)

    setTeamShots(allTagList.filter(t => t.action_result_id === 3 && t.team_id === teamId))
    setOpponentShots(opponentTagList.filter(t => t.action_result_id === 3 && t.team_id !== teamId))

  }, [allTagList, opponentTagList])

  useEffect(() => {
    handleActionTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expand, tagList])

  const handleActionTags = () => {
    const actionTags = tagList?.filter(t =>
      (RULE[expand]?.opponent === (t.team_id !== teamId)) &&
      !!RULE[expand].row.find(a =>
        a.action_id === t.action_id &&
        (!a?.action_result_id ? true : a.action_result_id.includes(t.action_result_id)) &&
        (!a?.action_type_id ? true : a.action_type_id.includes(t.action_type_id)) &&
        (
          (!a?.susuccessful ? true : a?.susuccessful?.includes(t.action_result_id)) ||
          (!a?.unsusuccessful ? true : a?.unsusuccessful?.includes(t.action_result_id))
        )
      ));
    onActionSelected(actionTags)
  }
  return (
    <Box {...params}>
      <Box sx={{ display: "flex", justifyContent: "space-evenly", p: 1 }}>
        <Typography>Final Score</Typography>
        <Box sx={{ display: "flex" }}>
          <Typography
            sx={teamShots.length > 0 ? { textDecoration: "underline", cursor: "pointer" } : {}}
            onClick={() => onActionSelected(teamShots)}
          >
            {teamShots.length}
          </Typography>
          <Typography sx={{ px: 1 }}>{":"}</Typography>
          <Typography
            sx={opponentShots.length > 0 ? { textDecoration: "underline", cursor: "pointer" } : {}}
            onClick={() => onActionSelected(opponentShots)}
          >
            {opponentShots.length}
          </Typography>
        </Box>
      </Box>
      {
        RULE.map((rule, idx) => (
          <Accordion
            key={idx}
            onChange={(event, expanded) => { setExpand(expanded ? idx : -1); }}
            expanded={expand === idx}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ textAlign: "center" }}
              aria-controls="panel1a-content"
              id="panel1a-header"
              onClick={() => { handleActionTags() }}
            >
              <Typography >{rule.title} ({rule.title_he})</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Table responsive="sm" striped borderless hover size="sm" className='text-uppercase coach-actionlist-table'>
                <tbody className='text-center' style={{ m: 0 }}>
                  {!!rule?.successful && <tr>
                    {rule.title === "Shot" ?
                      <>
                        <td></td>
                        <td><p>On Target</p></td>
                        <td><p>Off Target</p></td>
                      </>
                      :
                      <>
                        <td></td>
                        <td><p>Successful</p></td>
                        <td><p>Unsuccessful</p></td>
                      </>
                    }
                  </tr>}
                  {rule.row.map((type, i) => {
                    const data = !!tagList ? tagList.filter(t =>
                      (RULE[expand]?.opponent === (t.team_id !== teamId)) &&
                      t.action_id === type.action_id &&
                      (!type?.action_result_id ? true : type.action_result_id.includes(t.action_result_id)) &&
                      (!type?.action_type_id ? true : type.action_type_id.includes(t.action_type_id))
                    ) : []
                    const success = data.filter(f => !rule?.successful ? true : rule?.successful.includes(f.action_result_id))
                    const unsuccess = data.filter(f => !rule?.unsuccessful ? true : rule?.unsuccessful.includes(f.action_result_id))
                    return (
                      <tr key={i}>
                        <td style={{ width: "20%", minWidth: 120 }}><p>{type.title}</p></td>
                        <td
                          width="40%"
                          onClick={() => { !!success.length && onActionSelected(success) }}
                        >
                          <p className={success.length > 0 ? (rule.title === 'Turnover' || rule.title === 'Foul')
                            ? "statistic-clickable-unsuccess"
                            : "statistic-clickable-success"
                            : ""}>{success.length}</p>
                        </td>
                        {
                          !!rule?.successful &&
                          <td
                            width="40%"
                            onClick={() => { !!unsuccess.length && onActionSelected(unsuccess) }}
                          >
                            <p className={unsuccess.length > 0 ? "statistic-clickable-unsuccess" : ""}>{unsuccess.length}</p>
                          </td>
                        }
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </AccordionDetails>
          </Accordion>
        ))
      }
    </Box >
  );
}
