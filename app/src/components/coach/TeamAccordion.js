import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table, } from 'react-bootstrap'

export default function TeamAccordion({ playTags, allTagList = [], opponentTagList = [], onActionSelected, teamId, t, ...params }) {
  const [expand, setExpand] = useState(0)

  const [tagList, setTagList] = useState([])
  const [teamShots, setTeamShots] = useState([])
  const [opponentShots, setOpponentShots] = useState([])

  const RULE = [
    {
        opponent: false,
        title: t("Shot"),
        successful: [1, 3],
        unsuccessful: [2],
        row: [
            { action_id: 1, action_type_id: [1], title: t("Right") },
            { action_id: 1, action_type_id: [2], title: t("Left") },
            { action_id: 1, action_type_id: [3], title: t("Header") },
            { action_id: 1, action_type_id: [11], title: t("FreeKick") },
            { action_id: 1, action_type_id: [13], title: t("Penalty") }
        ]
    },
    {
        opponent: false,
        title: t("Pass"),
        successful: [4],
        unsuccessful: [11, 15],
        row: [
            { action_id: 2, action_type_id: [7], title: t("KeyPass") },
            { action_id: 2, action_type_id: [6], title: t("ThroughPass") },
            { action_id: 2, action_type_id: [5], title: t("LongPass") },
            { action_id: 2, action_type_id: [4], title: t("ShortPass") },
            { action_id: 2, action_type_id: [14], title: t("ThrowIn") },
            { action_id: 2, action_type_id: [11], title: t("FreeKick") }]
    },
    {
        opponent: false,
        title: t("Dribble"),
        successful: [4],
        unsuccessful: [12, 17],
        row: [
            { action_id: 4, action_type_id: [1], title: t("Right") },
            { action_id: 4, action_type_id: [2], title: t("Left") }
        ]
    },
    {
        opponent: false,
        title: t("Cross"),
        successful: [4],
        unsuccessful: [7, 8, 15],
        row: [
            { action_id: 3, action_type_id: [1], title: t("Right") },
            { action_id: 3, action_type_id: [2], title: t("Left") },
            { action_id: 3, action_type_id: [11], title: t("FreeKick") },
            { action_id: 3, action_type_id: [12], title: t("Corner") }
        ]
    },
    {
        opponent: false,
        title: t("Foul"),
        row: [
            { action_id: 5, action_type_id: [8], title: t("Regular") },
            { action_id: 5, action_type_id: [9], title: t("YellowCard") },
            { action_id: 5, action_type_id: [10], title: t("RedCard") }
        ]
    },
    {
        opponent: false,
        title: t("DrawFoul"),
        row: [
            { action_id: 6, action_type_id: [8], title: t("Regular") },
            { action_id: 6, action_type_id: [9], title: t("YellowCard") },
            { action_id: 6, action_type_id: [10], title: t("RedCard") }]
    },
    {
        opponent: false,
        title: t("Interception"),
        row: [
            { action_id: 10, action_type_id: [1, 2], title: t("Dribble") },
            { action_id: 10, action_type_id: [7], title: t("KeyPass") },
            { action_id: 10, action_type_id: [6], title: t("ThroughPass") },
            { action_id: 10, action_type_id: [5], title: t("LongPass") },
            { action_id: 10, action_type_id: [4], title: t("ShortPass") },
            { action_id: 10, action_type_id: [14], title: t("ThrowIn") }]
    },
    {
        opponent: false,
        title: t("Turnover"),
        row: [
            { action_id: 2, action_result_id: [11], title: t("BadPass") },
            { action_id: 4, action_result_id: [10, 12], title: t("BadDribble") },
            { action_id: 7, action_result_id: [15], title: t("Offside") },
        ]
    },
    {
        opponent: false,
        title: t("Saved"),
        row: [
            { action_id: 8, action_type_id: [1, 2], title: t("Foot") },
            { action_id: 8, action_type_id: [3], title: t("Header") }
        ]
    },
    {
        opponent: false,
        title: t("Clearance"),
        row: [
            { action_id: 11, action_type_id: [1, 2], title: t("Foot") },
            { action_id: 11, action_type_id: [3], title: t("Header") }
        ]
    },
    {
        opponent: true,
        title: t("OpponentShot"),
        successful: [1, 3],
        unsuccessful: [2],
        row: [
            { action_id: 1, action_type_id: [1], title: t("Right") },
            { action_id: 1, action_type_id: [2], title: t("Left") },
            { action_id: 1, action_type_id: [3], title: t("Header") },
            { action_id: 1, action_type_id: [11], title: t("FreeKick") },
            { action_id: 1, action_type_id: [13], title: t("Penalty") }
        ]
    },
    {
        opponent: true,
        title: t("OpponentCross"),
        successful: [4],
        unsuccessful: [7, 8, 15],
        row: [
            { action_id: 3, action_type_id: [1], title: t("Right") },
            { action_id: 3, action_type_id: [2], title: t("Left") },
            { action_id: 3, action_type_id: [11], title: t("FreeKick") },
            { action_id: 3, action_type_id: [12], title: t("Corner") }
        ]
    },
  ]

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
        <Typography>{t("FinalScore")}</Typography>
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
              <Typography >{rule.title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Table responsive="sm" striped borderless hover size="sm" className='text-uppercase coach-actionlist-table'>
                <tbody className='text-center' style={{ m: 0 }}>
                  {!!rule?.successful && <tr>
                    {rule.title === "Shot" ?
                      <>
                        <td></td>
                        <td><p>{t("OnTarget")}</p></td>
                        <td><p>{t("OffTarget")}</p></td>
                      </>
                      :
                      <>
                        <td></td>
                        <td><p>{t("Successful")}</p></td>
                        <td><p>{t("Unsuccessful")}</p></td>
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
