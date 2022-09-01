import React, { useState, useReducer } from 'react';

import _ from 'lodash';
import { Paper, Card, IconButton } from '@mui/material';

import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import TeamTagTable from '../TeamTagTable';
import ExcelButton from '../ExcelButton';
import SportCodeButton from '../SportCodeButton';
import IndividualTagTable from '../IndividualTagTable';
import TeamAccordion from '../TeamAccordion';
import VideoPlayer from '../VideoPlayer';

const GameTab = ({ allTagList, game, playerList, playersInGameList, opponentTagList, teamId, t }) => {
    const [showAccordion, setShowAccordion] = useState(true);
    const [curTeamTagIdx, setCurTeamTagIdx] = useState(0);
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        teamTagList: [],
        actionTagList: []
    });
    const { teamTagList, actionTagList } = state;

    const [videoData, setVideodata] = useReducer((old, action) => ({ ...old, ...action }), {
        idx: 0,
        autoPlay: true,
        tagList: [],
        videoPlay: false
    });

    return (
        <>
            <Card style={{ minWidth: 310, overflowY: 'scroll', fontSize: 12, display: showAccordion ? '' : 'none', mb: 1 }}>
                <TeamAccordion
                    allTagList={allTagList}
                    opponentTagList={opponentTagList}
                    teamId={teamId}
                    playTags={(res) => {}}
                    onActionSelected={(res) => {
                        const teamTags = _.uniqBy(res, 'team_tag_id');
                        setState({
                            actionTagList: res,
                            teamTagList: teamTags
                        });
                        setCurTeamTagIdx(0);
                        setVideodata({
                            idx: 0,
                            autoPlay: true,
                            tagList: teamTags.map((t) => {
                                return {
                                    start_time: t.t_start_time,
                                    end_time: t.t_end_time
                                };
                            }),
                            videoPlay: false
                        });
                    }}
                    t={t}
                />
            </Card>
            {document.body.style.direction === 'ltr' ? (
                <IconButton onClick={() => setShowAccordion((v) => !v)} sx={{ background: '#8080804d', zIndex: 10, position: 'absolute', left: showAccordion ? 310 : 10 }}>
                    {showAccordion ? <ArrowLeftIcon /> : <ArrowRightIcon />}
                </IconButton>
            ) : (
                <IconButton onClick={() => setShowAccordion((v) => !v)} sx={{ background: '#8080804d', zIndex: 10, position: 'absolute', right: showAccordion ? 300 : 10 }}>
                    {showAccordion ? <ArrowRightIcon /> : <ArrowLeftIcon />}
                </IconButton>
            )}
            <Paper style={{ height: '100%', minWidth: 500, position: 'relative' }} className="coach-tag-table">
                {/*              <ExcelButton
                    style={{ position: "absolute", right: 10 }}
                    team={allTagList}
                    t={t}
                />*/}
                <SportCodeButton style={{ position: 'absolute', left: 35 }} game={game} team={allTagList} teamId={teamId} playerList={playerList} playersInGameList={playersInGameList} t={t} />

                <TeamTagTable
                    sx={{ height: '70%', p: 1, width: '100%' }}
                    rows={teamTagList}
                    updateTagList={(newTeamTag) => {
                        teamTagList.find((t) => t.team_tag_id === newTeamTag.team_tag_id);
                    }}
                    handleRowClick={({ row, idx }) => {
                        setCurTeamTagIdx(idx);
                        setVideodata({
                            idx,
                            tagList: teamTagList.map((t) => {
                                return {
                                    start_time: t.t_start_time,
                                    end_time: t.t_end_time
                                };
                            }),
                            autoPlay: true,
                            videoPlay: false
                        });
                    }}
                    selected={curTeamTagIdx}
                    onPlay={({ row, idx }) => {
                        setCurTeamTagIdx(idx);
                        setVideodata({
                            idx,
                            tagList: teamTagList.map((t) => {
                                return {
                                    start_time: t.t_start_time,
                                    end_time: t.t_end_time
                                };
                            }),
                            cnt: new Date(),
                            autoPlay: true,
                            videoPlay: true
                        });
                    }}
                    t={t}
                />
                <IndividualTagTable
                    sx={{ height: '30%', p: 1, width: '100%' }}
                    rows={actionTagList.filter((tag) => tag.team_tag_id === teamTagList[curTeamTagIdx]?.team_tag_id)}
                    offenseTeam={playerList}
                    updateTagList={() => {}}
                    onPlay={(row) => {
                        setVideodata({
                            idx: 0,
                            autoPlay: false,
                            tagList: [row],
                            videoPlay: true
                        });
                    }}
                    t={t}
                />
            </Paper>
            <VideoPlayer videoData={videoData} url={game?.video_url ?? ''} onChangeClip={(idx) => setCurTeamTagIdx(idx)} drawOpen={showAccordion} isSpecial={false} />
        </>
    );
};

export default GameTab;
