import CryptoJS from 'crypto-js'
import builder from 'xmlbuilder'
import fileDownload from 'js-file-download'
import { SECRET } from "../config/settings"
import { DEMO } from "./staticData"
import gameService from '../services/game.service'

export const createCommand = async (tagList, name) => {


  let rawVideoList = [...new Set(tagList.map(tag => tag.video_url))]
  let videoList = await Promise.all(rawVideoList.map(async url => {
    if (url?.startsWith("https://www.youtube.com")) {
      return (await gameService.getAsyncNewStreamURL(url)).url
    }
    return url
  }))

  let videos = videoList.map((tag, i) => {
    return {
      url: tag,
      SecondBoxText: tagList[0]?.player_fname ? `#${tagList[0]?.jersey} ${tagList[0]?.player_fname} ${tagList[0]?.player_lname}` : name
    }
  })

  let clips = tagList.map((tag, i) => {
    return {
      Video: rawVideoList.indexOf(tag.video_url) + 1,
      Trim: `${toSecond(tag.start_time)}:${toSecond(tag.end_time)}`,
      FirstBoxText: `${tag.action_name ?? "Team Actions"}`,
    }
  })

  let obj = {
    Render: {
      FileData: {
        Name: name,
        Format: 'mp4',
        Resolution: '1280x720',
        FPS: '60',
        Preset: 'ultrafast',
        FontFile: 'ArialBold.ttf',
        FontColor: 'White',
        FontSize: '35',
        FirstBoxSize: '300x60',
        FirstBoxColor: '#808080@0.7',
        FirstBoxFormat: 'rgba',
        SeconBoxSize: '500x60',
        SecondBoxColor: '#FFA500@0.7',
        SecondBoxFormat: 'rgba',
        LogoURL: 'https://s3.eu-west-1.amazonaws.com/scouting4u.com/IMG/JustSmallLogo.png',
      },
      Videos: { Video: videos },
      Clips: { Clip: clips }
    }
  };

  const command = builder.create(obj).end({ pretty: true });

  // const command = `ffmpeg - y - i "${url}" - f lavfi - i color = color =#808080@0.7: size = 300x60, format = rgba - f lavfi - i color = color = #FFA500@0.7: size = ${ !tagList[0]?.player_fname ? "540" : "340" } x60, format = rgba - i "https://s3.eu-west-1.amazonaws.com/scouting4u.com/IMG/JustSmallLogo.png" - filter_complex "${tagList.map((tag, i) =>
  //   `[0:v]trim=${toSecond(tag.start_time)}:${toSecond(tag.end_time)},setpts=PTS-STARTPTS[v${i}];[1:v]drawtext=text='${tag.action_name ?? "Team Actions"}':fontfile=ArialBold.ttf:x=(w-text_w)/2:y=(h-text_h)/2:fontsize=37:fontcolor=white[trans_gray_tx${i ? i : ''}];[v${i}][trans_gray_tx${i ? i : ''}]overlay=shortest=1:x=20:y=H-h-20[v_${i}];[0:a]atrim=${toSecond(tag.start_time)}:${toSecond(tag.end_time)},asetpts=PTS-STARTPTS[a${i}];`).join("")
  //   }${tagList.map((tag, i) => `[v_${i}][a${i}]`).join("")
  //   }concat=n=${tagList.length}:v=1:a=1[outv][outa];[2:v]drawtext=text='${!tagList[0]?.player_fname ? name : `#${tagList[0]?.jersey} ${tagList[0]?.player_fname}`}':fontfile=ArialBold.ttf:x=(w-text_w)/2:y=(h-text_h)/2:fontsize=37:fontcolor=white[trans_org_tx];[outv][trans_org_tx]overlay=shortest=1:x=262:y=H-h-20[v_org];[v_org][3:v]overlay=W-w-20:H-h-20[v_t_logo]" -map "[v_t_logo]" -map "[outa]" -preset superfast "${name}.mp4"`

  fileDownload(command, `${name}.xml`);
}

export function toHHMMSS(data) {
  if (!data || data === "") return "00:00:00"
  let sec_num = parseInt(data, 10); // don't forget the second param
  if (sec_num < 0) sec_num = 0;
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return hours + ':' + minutes + ':' + seconds;
}

export function addSecToHHMMSS(str, sec) {
  return toHHMMSS(toSecond(str) + sec)
}

export function subSecToHHMMSS(str, sec) {
  return toHHMMSS(toSecond(str) - sec)
}

export function toSecond(data) {
  if (!data || data === "") return 0
  let a = data.split(':'); // split it at the colons

  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
}
export function getUser() {
  try {
    const user = localStorage.getItem("user")
      ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem("user"), SECRET).toString(CryptoJS.enc.Utf8))
      : null;
    return user
  } catch (e) {
    console.error("loading user error");
    return null
  }
}
export function setUser(user) {
  try {
    localStorage.setItem("user", CryptoJS.AES.encrypt(JSON.stringify(user), SECRET).toString());
  } catch (e) {
    console.error("saving user error");
  }
}

export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export function divideTags(tagList) {
  let actions = {}
  tagList.forEach(tag => {
    const actionKey = tag.action_name
    const typeKey = tag.action_type_name
    let success = actions?.[actionKey]?.[typeKey]?.success ?? []
    let unsuccess = actions?.[actionKey]?.[typeKey]?.unsuccess ?? []

    if (DEMO?.[actionKey]?.success.includes(tag.action_result_name)) {
      success = [...success, tag]
    } else {
      unsuccess = [...unsuccess, tag]
    }

    actions = {
      ...actions,
      [actionKey]: {
        ...actions?.[actionKey],
        [typeKey]: { success, unsuccess }
      }
    }
  })
  return actions
}

export function filterSuccessTags(tagList) {
  let actions = {}
  tagList.forEach(tag => {
    const actionKey = tag.action_name
    let success = actions?.[actionKey] ?? []

    if (DEMO?.[actionKey]?.success.includes(tag.action_result_name)) {
      success = [...success, tag]
      actions = {
        ...actions,
        [actionKey]: [success]
      }
    }
  })
  return actions
}

export function getPercent(value, max) {
  return value * 100 / max;
}

export function manualFilterForTags(tagList, playerId, t) {
  const filterData = [
    {
      title: t("Goal"), action: 1, action_type: null, action_result: [3],
    },
    {
      title: t("Assist"), action: 9, action_type: null, action_result: null,
    },
    {
      title: t("Shot"), action: 1, action_type: null, action_result: [1],
    },
    {
      title: t("Cross"), action: 3, action_type: null, action_result: [4],
    },
    {
      title: t("Dribble"), action: 4, action_type: null, action_result: [4],
    },
    {
      title: t("ThroughPass"), action: 2, action_type: 6, action_result: [4],
    },
    {
      title: t("ShortPass"), action: 2, action_type: 4, action_result: [4],
    },
    {
      title: t("LongPass"), action: 2, action_type: 5, action_result: [4],
    },
    {
      title: t("KeyPass"), action: 2, action_type: 7, action_result: [4],
    },
    {
      title: t("HeaderPass"), action: 2, action_type: 3, action_result: [4],
    },
    {
      title: t("DrawFoul"), action: 6, action_type: null, action_result: [13, 14],
    },
    {
      title: t("Interception"), action: 10, action_type: null, action_result: null,
    },
    {
      title: t("Clearance"), action: 11, action_type: null, action_result: null,
    },
    {
      title: t("Saved"), action: 8, action_type: null, action_result: null,
    },
    {
      title: t("ThrowIn"), action: 2, action_type: 14, action_result: [4],
    },
  ]
  return filterData.map(f => {
    const total = tagList.filter(tag => tag.action_id === f.action &&
      (f.action_type === null ? true : tag.action_type_id === f.action_type) &&
      (f.action_result === null ? true : f.action_result.includes(tag.action_result_id))
    )
    return {
      title: f.title,
      success: total.filter(f => f.player_id === playerId),
      total: total.length
    }
  })
    .filter(f => f.success.length > 0)
}
export function filterAllTags(tagList, playerId) {
  let actions = {}
  const playerTag = tagList.filter(f => f.player_id === playerId)
  playerTag.forEach(tag => {
    const actionKey = tag.action_name

    actions = {
      ...actions,
      [actionKey]: !actions?.[actionKey] ?
        {
          total: 1,
          success: []
        } : {
          ...actions?.[actionKey],
          total: actions?.[actionKey].total + 1
        }
    }

    let success = actions?.[actionKey]?.success ?? []

    if (tag.player_id === playerId && DEMO?.[actionKey]?.success.includes(tag.action_result_name)) {
      success = [...success, tag]
      actions = {
        ...actions,
        [actionKey]: {
          ...actions?.[actionKey],
          success
        }
      }
    }
  })

  // then sort by success length

  return Object.keys(actions).map(key => { return { ...actions[key], action: key } }).sort((a, b) => b.total - a.total)
}