import React, { useState, useEffect } from 'react';
import { Col, Container, ProgressBar, Row, Tab, Table, Tabs } from 'react-bootstrap'
import { divideTags } from '../../../common/utilities';

export default function StatisticTab({ tagList, playTags }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        const actions = divideTags(tagList)
        setData(actions)
    }, [tagList])
    return (
        <>
            {data && Object.keys(data).map((key, idx) =>
                <Table responsive="sm" striped borderless hover size="sm" className='shots' key={idx}>
                    <tbody className='text-center'>
                        <tr>
                            <td></td>
                            <td colSpan={2}><p className='text-center'>{key}</p></td>
                        </tr>
                        <tr>
                            <td></td>
                            {key === "Shot" ?
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
                        {Object.keys(data[key]).map((type, i) => {
                            const success = data[key][type]?.success
                            const unsuccess = data[key][type]?.unsuccess
                            return (
                                <tr key={i}>
                                    <td><p>{type}</p></td>
                                    <td onClick={() => { !!success.length && playTags(success) }}><p>{success.length}</p></td>
                                    <td onClick={() => { !!unsuccess.length && playTags(unsuccess) }}><p >{unsuccess.length}</p></td>
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