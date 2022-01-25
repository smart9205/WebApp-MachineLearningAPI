import React, { useState, useEffect } from 'react';
import { Table, } from 'react-bootstrap'
import { divideTags } from '../../../common/utilities';

const RULE = [
    {
        title: "Shot",
        successful: [1, 3],
        unsuccessful: [2],
        row: [
            { action_id: 1, action_type_id: [1], title: "Right" },
            { action_id: 1, action_type_id: [2], title: "Left" },
            { action_id: 1, action_type_id: [3], title: "Header" },
            { action_id: 1, action_type_id: [11], title: "Free-Kick" },
            { action_id: 1, action_type_id: [13], title: "Penalty" }
        ]
    },
    {
        title: "Pass",
        successful: [4],
        unsuccessful: [11, 15],
        row: [
            { action_id: 2, action_type_id: [7], title: "Key Pass" },
            { action_id: 2, action_type_id: [6], title: "Through Pass" },
            { action_id: 2, action_type_id: [5], title: "Long Pass" },
            { action_id: 2, action_type_id: [4], title: "Short Pass" },
            { action_id: 2, action_type_id: [14], title: "Throw-In" },
            { action_id: 2, action_type_id: [11], title: "Free Kick" }]
    },
    {
        title: "Dribble",
        successful: [4],
        unsuccessful: [10, 17],
        row: [
            { action_id: 4, action_type_id: [1], title: "Right" },
            { action_id: 4, action_type_id: [2], title: "Left" }
        ]
    },
    {
        title: "Cross",
        successful: [4],
        unsuccessful: [7, 8, 15],
        row: [
            { action_id: 3, action_type_id: [1], title: "Right" },
            { action_id: 3, action_type_id: [2], title: "Left" },
            { action_id: 3, action_type_id: [11], title: "Free Kick" },
            { action_id: 3, action_type_id: [12], title: "Corner" }
        ]
    },
    {
        title: "Draw Foul",
        row: [
            { action_id: 6, action_type_id: [8], title: "Regular" },
            { action_id: 6, action_type_id: [9], title: "Yellow Card" },
            { action_id: 6, action_type_id: [10], title: "Red Card" }]
    },
    {
        title: "Interception",
        row: [
            { action_id: 10, action_type_id: [1, 2], title: "Dribble" },
            { action_id: 10, action_type_id: [7], title: "Key Pass" },
            { action_id: 10, action_type_id: [6], title: "Through Pass" },
            { action_id: 10, action_type_id: [5], title: "Long Pass" },
            { action_id: 10, action_type_id: [4], title: "Short Pass" },
            { action_id: 10, action_type_id: [14], title: "Throw-In" }]
    },
    {
        title: "Saved",
        row: [
            { action_id: 8, action_type_id: [1, 2], title: "Foot" },
            { action_id: 8, action_type_id: [3], title: "Header" }
        ]
    },
    {
        title: "Clearance",
        row: [
            { action_id: 11, action_type_id: [1, 2], title: "Foot" },
            { action_id: 11, action_type_id: [3], title: "Header" }
        ]
    },
    {
        title: "Turnover",
        row: [
            { action_id: 2, action_type_id: [11], title: "Bad Pass" },
            { action_id: 4, action_type_id: [10, 12], title: "Bad Dribble" },
            { action_id: 7, action_type_id: [15], title: "Offside" },
        ]
    },
    {
        title: "Foul",
        row: [
            { action_id: 5, action_type_id: [8], title: "Regular" },
            { action_id: 5, action_type_id: [9], title: "Yellow Card" },
            { action_id: 5, action_type_id: [10], title: "Red Card" }
        ]
    },
]

export default function StatisticTab({ tagList, playTags }) {
    console.log("playlist", tagList)
    return (
        <>
            {RULE.map((rule, idx) =>
                <Table responsive="sm" striped borderless hover size="sm" className='shots text-uppercase' key={idx}>
                    <thead>
                        <th colSpan={3} className='shots-title text-center'>
                            {rule.title}
                        </th>
                    </thead>
                    <tbody className='text-center statistic-table-body'>
                        {
                            !!rule?.successful && <tr>
                                <td></td>
                                <td><p>Successful</p></td>
                                <td><p>Unsuccessful</p></td>
                            </tr>
                        }
                        {rule.row.map((type, i) => {
                            const data = tagList.filter(t =>
                                t.action_id === type.action_id &&
                                type.action_type_id.includes(t.action_type_id)
                            )
                            const success = data.filter(f => !rule?.successful ? true : rule?.successful.includes(f.action_result_id))
                            const unsuccess = data.filter(f => !rule?.unsuccessful ? true : rule?.unsuccessful.includes(f.action_result_id))
                            return (
                                <tr key={i}>
                                    <td width={120}><p>{type.title}</p></td>
                                    <td onClick={() => { !!success.length && playTags(success) }}>
                                        <p className={success.length > 0 ? "statistic-clickable-success" : ""}>{success.length}</p>
                                    </td>
                                    {
                                        !!rule?.successful &&
                                        <td onClick={() => { !!unsuccess.length && playTags(unsuccess) }}>
                                            <p className={success.length > 0 ? "statistic-clickable-unsuccess" : ""}>{unsuccess.length}</p>
                                        </td>
                                    }
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            )
            }
        </>
    )
}