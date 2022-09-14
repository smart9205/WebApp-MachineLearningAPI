import React from 'react';

const DownloadXML = ({ blob, game }) => {
    const getActualDate = new Date(game.date);
    const date = getActualDate.getDate();
    const month = getActualDate.getMonth() + 1;
    const year = getActualDate.getFullYear();
    const gameDate = '(' + date + '-' + month + '-' + year + ')';

    const fileName = game.home_team_name.split('_').join(' ') + ' vs ' + game.away_team_name + ' ' + gameDate + '.xml';
    var pom = document.createElement('a');
    pom.setAttribute('href', window.URL.createObjectURL(blob));
    pom.setAttribute('download', fileName);
    pom.dataset.downloadurl = ['text/xml', pom.download, pom.href].join(':');
    pom.draggable = true;
    pom.classList.add('dragout');
    pom.click();

    return <></>;
};

export default DownloadXML;
