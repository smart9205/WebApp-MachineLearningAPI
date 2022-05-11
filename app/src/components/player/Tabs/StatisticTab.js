import React from 'react';
import { Table, } from 'react-bootstrap'


export default function StatisticTab({ tagList, playTags, t }) {
    const RULE = [
        {
            opponent: false,
            title: t("Shot"),
            id: "Shot",
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
            id: "Pass",
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
            id: "Dribble",
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
            id: "Cross",
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
            id: "Foul",
            row: [
                { action_id: 5, action_type_id: [8], title: t("Regular") },
                { action_id: 5, action_type_id: [9], title: t("YellowCard") },
                { action_id: 5, action_type_id: [10], title: t("RedCard") }
            ]
        },
        {
            opponent: false,
            title: t("DrawFoul"),
            id: "DrawFoul",
            row: [
                { action_id: 6, action_type_id: [8], title: t("Regular") },
                { action_id: 6, action_type_id: [9], title: t("YellowCard") },
                { action_id: 6, action_type_id: [10], title: t("RedCard") }]
        },
        {
            opponent: false,
            title: t("Interception"),
            id: "Interception",
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
            id: "Turnover",
            row: [
                { action_id: 2, action_result_id: [11], title: t("BadPass") },
                { action_id: 4, action_result_id: [10, 12], title: t("BadDribble") },
                { action_id: 7, action_result_id: [15], title: t("Offside") },
            ]
        },
        {
            opponent: false,
            title: t("Saved"),
            id: "Saved",
            row: [
                { action_id: 8, action_type_id: [1, 2], title: t("Foot") },
                { action_id: 8, action_type_id: [3], title: t("Header") }
            ]
        },
        {
            opponent: false,
            title: t("Clearance"),
            id: "Clearance",
            row: [
                { action_id: 11, action_type_id: [1, 2], title: t("Foot") },
                { action_id: 11, action_type_id: [3], title: t("Header") }
            ]
        }
    ]

    return (
        <>
            {RULE.map((rule, idx) =>
                <Table responsive="sm" striped borderless hover size="sm" className='shots' key={idx}>
                    <tbody className='text-center statistic-table-body'>
                        <tr className='shots-title text-center'>
                            <td colSpan={3} className="text-uppercase">
                                {rule.title}
                            </td>
                        </tr>
                        {
                            !!rule?.successful && <tr>
                                <td></td>
                                {rule.id === "Shot" ?
                                    <>
                                        <td><p>{t("OnTarget")}</p></td>
                                        <td><p>{t("OffTarget")}</p></td>
                                    </>
                                    :
                                    <>
                                        <td><p>{t("Successful")}</p></td>
                                        <td><p>{t("Unsuccessful")}</p></td>
                                    </>
                                }
                            </tr>

                        }
                        {rule.row.map((type, i) => {
                            const data = tagList.filter(t =>
                                t.action_id === type.action_id &&
                                (!type?.action_result_id ? true : type.action_result_id.includes(t.action_result_id)) &&
                                (!type?.action_type_id ? true : type.action_type_id.includes(t.action_type_id))
                            )
                            const success = data.filter(f => !rule?.successful ? true : rule?.successful.includes(f.action_result_id))
                            const unsuccess = data.filter(f => !rule?.unsuccessful ? true : rule?.unsuccessful.includes(f.action_result_id))
                            return (
                                <tr key={i}>
                                    <td style={{ width: "20%", minWidth: 120 }}><p>{type.title}</p></td>
                                    <td width="40%" onClick={() => { !!success.length && playTags(success) }}>
                                        <p className={success.length > 0 ? "statistic-clickable-success" : ""}>{success.length}</p>
                                    </td>
                                    {
                                        !!rule?.successful &&
                                        <td width="40%" onClick={() => { !!unsuccess.length && playTags(unsuccess) }}>
                                            <p className={unsuccess.length > 0 ? "statistic-clickable-unsuccess" : ""}>{unsuccess.length}</p>
                                        </td>
                                    }
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            )}
        </>
    )
}