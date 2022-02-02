import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table, } from 'react-bootstrap'
import { RULE } from '../../common/staticData';

export default function TeamAccordion({ playTags, tagList = [], ...params }) {
  console.log("taglist", tagList)
  const [expand, setExpand] = useState(0)
  return (
    <Box {...params}>
      {RULE.map((rule, idx) => (
        <Accordion
          key={idx}
          onChange={(event, expanded) => { console.log("Accordion changed", expanded); setExpand(idx) }}
          expanded={expand === idx}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ textAlign: "center" }}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography >{rule.title}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Table responsive="sm" striped borderless hover size="sm" className='text-uppercase coach-actionlist-table'>
              <tbody className='text-center' style={{ m: 0 }}>
                {
                  !!rule?.successful && <tr>
                    <td></td>
                    {rule.title === "Shot" ?
                      <>
                        <td><p>On Target</p></td>
                        <td><p>Off Target</p></td>
                      </>
                      :
                      <>
                        <td><p>Successful</p></td>
                        <td><p>Unsuccessful</p></td>
                      </>
                    }
                  </tr>

                }
                {rule.row.map((type, i) => {
                  const data = tagList.filter(t =>
                    t.action_id === type.action_id &&
                    (!type?.action_result_id ? true : t.action_result_id === type.action_result_id) &&
                    (!type?.action_type_id ? true : type.action_type_id.includes(t.action_type_id))
                  )
                  const success = data.filter(f => !rule?.successful ? true : rule?.successful.includes(f.action_result_id))
                  const unsuccess = data.filter(f => !rule?.unsuccessful ? true : rule?.unsuccessful.includes(f.action_result_id))
                  return (
                    <tr key={i}>
                      <td style={{ width: "20%", minWidth: 120 }}><p>{type.title}</p></td>
                      <td
                        width="40%"
                      // onClick={() => { !!success.length && playTags(success) }}
                      >
                        <p className={success.length > 0 ? "statistic-clickable-success" : ""}>{success.length}</p>
                      </td>
                      {
                        !!rule?.successful &&
                        <td
                          width="40%"
                        // onClick={() => { !!unsuccess.length && playTags(unsuccess) }}
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
      ))}
    </Box>
  );
}
