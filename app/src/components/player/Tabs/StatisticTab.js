import React from 'react';
import { Table, } from 'react-bootstrap'
import { RULE } from '../../../common/staticData';


export default function StatisticTab({ tagList, playTags }) {
    return (
        <>
            {RULE.map((rule, idx) =>
                <Table responsive="sm" striped borderless hover size="sm" className='shots' key={idx}>
                    <tbody className='text-center statistic-table-body'>
                        <tr className='shots-title text-center'>
                            <td colSpan={3} >
                                {rule.title}
                            </td>
                        </tr>
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